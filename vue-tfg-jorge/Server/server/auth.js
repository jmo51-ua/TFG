// Control de acceso
// Usa la tabla 'user' para la autenticación
// Usa las tablas acl para la autorización

const bCrypt = require("bcryptjs"); // cifrado de datos

// Debug
module.debug = false;
function debug(method, ...args) {
	if (module.debug) console.info("[auth] " + method + ":", ...args);
}

module.exports.create = (config, dao) => {
	if (config.email.active) {
		// Envia un email
		const nodemailer = require("nodemailer"); // envío de emails

		function sendEmail(to, subject, text) {
			debug("sendMail", "Send email to", to, "Subject:", subject);

			var transporter = nodemailer.createTransport(config.email.config);

			transporter.sendMail({
				from: '"System" <' + config.email.from + '>', // sender address
				to: to,
				subject: subject,
				text: text
			}, (error, info) => {
				if (error) {
					return console.error("Error sending email:", error);
				}
				debug("sendMail", "Email %s sent: %s", info.messageId, info.response);
			});
		}

		// Detectar la creación de un usuario para enviarle el correo de bienvenida
		dao.user.on("create", (data) => {
			debug("user", "User Created", data);
			sendEmail(
				data.email,
				"New user created",
				"Wellcome, your new user has been created.\n\n\User data:\n\ - Name: " + data.name + " " + data.surname + "\n\ - Email: " + data.email + "\n\ - Password: " + data.password + "\n\n\If you want to change your user data or password, please access to your user settings after logging in."
			);
		});

		// Detectar el cambio de password para enviar un correo de aviso
		dao.user.on("update", (data) => {
			if (data.password === undefined) return;
			debug("user","Password updated", data);
			dao.user.read({ id: data.id }, ".", (err, user) => {
				if (err) return;
				sendEmail(
					user.email,
					"Password updated",
					"Your password has been updated.\n\nUser data:\n - Name: " + user.name + " " + user.surname + "\n - Email: " + user.email + "\n - Password: " + data.password + "\n\nIf you have not changed the password, please contact the administrator."
				);
			});
		});
	}

	/**
	 * Calcual el nivel de auth para un usuario accediendo a un elemento
	 * @param {Integer} userId Id del usuario que accede
	 * @param {Integer} elementId Id del elemento al que accede
	 * @param {Object} typeId Tipo del elemento
	 * @param {Function} callback Función de finalización callback(level)
	 */
	function authLevel(userId, elementId, elementType, callback) {
		debug("authLevel", "user:", userId, "element:", elementId, "type:", elementType);

		function err() {
			console.warn("authLevel: No existe el elemento", elementId);
			callback(levels.NONE.id);
		}

		function end(level = levels.AUTH.id) {
			var lists = {};
			for (let t in elementTypes) {
				if (elementTypes[t].parent === elementType.id) {
					lists[t] = level;
				}
			}
			callback(level, lists);
		}

		dao[elementType.schema].read({ id: elementId }, { fields: ["owner", "creator", elementType.parent_field] }).then((elm) => { // obtengo el propietario y el creador del elemento
			debug("authLevel", "datos del elemento", elementId, ":", elm);

			// ACCESO POR OWNER. Si soy el propietario (todos, yo, mi organización o un grupo mio) tengo todos los privilegios

			if (elm.owner === 0) { // es de cualquiera
				debug("authLevel", "el propietario es cualquiera (publico)");
				end();
				return;
			}

			if (elm.owner === userId) { // soy el propietario
				debug("authLevel", "soy el propietario del elemento");
				end();
				return;
			}

			dao.user.read({ id: userId }, "organization").then((userData) => { // obtener la organización del usuario
				debug("authLevel", "organización del usuario:", userData.organization);

				if (!userData.organization) { // los usuarios sin organización son super-usuarios
					end();
					return;
				}

				if (elm.owner === userData.organization) { // mi organización es el propierario
					debug("authLevel", "mi organización es el propietario del elemento");
					end();
					return;
				}

				dao.userGroup.read({ user: userId }, ".").then((ugs) => { // obtener los grupos del usuario
					ugs = ugs.map((g) => g.group);
					debug("autLevel", "grupos del usuario:", ugs)

					if (ugs.indexOf(elm.owner) >= 0) { // uno de mis grupos es el propierario
						debug("authLevel", "un grupo mio es el propietario del elemento");
						end();
						return;
					}

					// ACCESO POR ACL

					dao.aclElement.read({ element: elementId }, ".").then((acls) => { // obtener las acl para ese elemento
						debug("authLevel", "acls para el elemento:", acls);

						function calcAcl() {
							// Recorrer las acl y calcular el máximo de cada nivel
							var maxUser = -1, maxOrganization = -1, maxGroups = -1, maxAll = -1;
							acls.forEach((acl) => {
								if (acl.entity === userId) return maxUser = Math.max(maxUser, acl.level);
								if (acl.entity === 0) return maxAll = Math.max(maxAll, acl.level);
								if (acl.entity === userData.organization) return maxOrganization = Math.max(maxOrganization, acl.level);
								if (ugs.indexOf(acl.entity) >= 0) return maxGroups = Math.max(maxGroups, acl.level);
							});

							debug("authLevel", "maxs: user:", maxUser, "groups:", maxGroups, "org:", maxOrganization, "all:", maxOrganization);

							var level = levels.NONE.id;
							if (maxUser > -1) {
								level = maxUser;
							} else if (maxGroups > -1) {
								level = maxGroups;
							} else if (maxOrganization > -1) {
								level = maxOrganization;
							} else if (maxAll > -1) {
								level = maxAll;
							} else {
								// no se ha encontrado permiso
								debug("authLevel", "no tengo ningun permiso");
							}

							dao.aclList.read({ element: elementId }, ".").then((aclsList) => {
								debug("authLevel", "aclList:", aclsList);
								var listLevels = {};

								for (let t in elementTypes) {
									if (elementTypes[t].parent !== elementType.id) continue; // no es un tipo hijo
									var typeId = elementTypes[t].id;
									var acls = aclsList.filter((acl) => acl.type == typeId);
									var acl = acls.find((acl) => acl.entity == userId);
									if (acl) { listLevels[t] = acl.level; continue; }
									var groupMax = acls.reduce((max, acl) => ugs.indexOf(acl.entity) >= 0 ? Math.max(max, acl.level) : max, -1);
									if (groupMax >= 0) { listLevels[t] = groupMax; continue; }
									acl = acls.find((acl) => acl.entity == userData.organization);
									if (acl) { listLevels[t] = acl.level; continue; }
									acl = acls.find((acl) => acl.entity === 0);
									if (acl) { listLevels[t] = acl.level; continue; }
									listLevels[t] = level;
								};

								callback(level, listLevels);
							});
						}

						// si el tipo tiene padre mirar las aclType
						if (elementType.parent && elementType.parent_field) {
							dao.aclType.read({ element: elm[elementType.parent_field], type: elementType.id }, ".").then((acls2) => { // obtener acl del padre para este tipo
								debug("authLevel", "acls del padre:", acls2, "parentId:", elm[elementType.parent_field], "type:", elementType.id);
								acls2.forEach((acl) => {
									if (acl.creator === elm.creator) acls.push(acl); // es un elemento creado por el creator del acl
								});
								debug("authLevel", "acls totales:", acls);
								calcAcl();
							});
						} else {
							calcAcl();
						}
					}, err);
				}, err);
			}, err);
		}, err);
	}

	var levels = {};
	dao.aclLevel.staticData(true).then(() => { levels = dao.aclLevel.staticData("code"); });
	var elementTypes = {};
	dao.elementType.staticData(true).then(() => { elementTypes = dao.elementType.staticData("schema"); });	

	return {
        /**
         * Realiza la autenticación, a partir de unas credenciales (email & password) indica si el usuario es correcto
         * @param {Object} credential Credenciales (email & password) para la autenticación
         * @param {Function} callback Función que se invoca con el id de usuario autenticado o null si la autenticación falla
         */
		authentication: (credentials, callback) => {
			if (!credentials.email || !credentials.password) {
				console.warn("auth: Faltan credenciales:", credentials);
				return callback(null);
			}
			dao.user.read({ email: credentials.email }, { fields: ["password", "id"] }, (err, user) => {
				if (err || !user || !user.length) {
					console.warn("auth: No se ha encontrado el usuario con email:", credentials.email, user);
					return callback(null);
				}
				user = user[0];

				if (!bCrypt.compareSync(credentials.password, user.password)) {
					console.warn("auth: El password '" + credentials.password + "' no es el correcto para '" + credentials.email + "'");
					return callback(null);
				}

				return callback(user.id);
			});
		},

		/**
		 * Indica los accesos que tiene unusuario a un recurso
		 * @param {Integer} userId Id del usuario que accede
		 * @param {Schema} schema Esquema del tipo de recurso
		 * @param {Object} params Parámetros del recurso
		 * @param {Function} callback Función de finalización: callback(err, {read, create, write, delete, auth, lists:{}})
		 */
		authorization: (userId, schema, params, callback) => {
			var authAll = { read: true, create: true, write: true, delete: true, auth: true, lists: {} };

			var elementType = elementTypes[schema.name]; // obtener el tipo de entidad

			if (!elementType) return callback(authAll); // si no el tipo no está definido en entityTypes no tiene control de acceso

			debug("authorization", "usuario:", userId, "schema:", schema.name, "id:", params.id);

			authLevel(userId, params.id, elementType, (level, typeLevels) => {
				function levelToAuth(level) {
					return {
						read: level >= levels.READ.id,
						create: level >= levels.CREATE.id,
						write: level >= levels.WRITE.id,
						delete: level >= levels.DELETE.id,
						auth: level >= levels.AUTH.id,
					};
				}
				var auth = levelToAuth(level);
				auth.lists = {};
				for (let t in typeLevels) {
					auth.lists[t] = levelToAuth(typeLevels[t]);
				}
				debug("authorization", "level:", level, auth);
				callback(auth);
			});
		}
	}
}