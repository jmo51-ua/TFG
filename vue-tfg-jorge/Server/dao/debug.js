(function (isNode) {
	"use strict";

	var debug = {};

	var levels = { // asociación de métodos a niveles
		none: { level: 0, method: null },
		error: { level: 1, method: "error", label: "ERR", color: "red" },
		warn: { level: 2, method: "warn", label: "WRN", color: "magenta" },
		info: { level: 3, method: "info", label: "INF", color: "green" },
		log: { level: 4, method: "log", label: "LOG", color: "cyan" },
		debug: { level: 5, method: "debug", label: "DEBUG", color: "yellow" }
	};

	// analiza un nivel y lo transforma a entero
	function getLevel(lvl) {
		if (lvl === undefined) return lvl;
		if (typeof lvl === "string") {
			lvl = lvl.toLowerCase();
			if (!levels[lvl]) {
				console.warn("Debug string level incorrect:", lvl);
				return;
			}
			return levels[lvl].level
		}
		return lvl;
	}

	/**
	 * Referencia al objeto console original
	 */
	debug.original = isNode ? global.console : window.console;;
	var original = debug.original;

	var level = levels.log.level; // Nivel de depuración
	// Opciones de depuración
	var active = false; // modo debug activo
	var showModule = false; // mostrar nombre de modulo
	var showFunction = false; // mostrar nombre de función
	var showLine = false; // mostrar linea

	/**
	 * Establece u obtiene el nivel de depuración por defecto.<br />
	 * Los mensajes con un nivel superior al establecido serán ignorados<br />
	 * El nivel puede ser indicado en su valor numérico o textual.<br />
	 * Niveles:
	 * <ul>
	 * <li>0 NONE</li>
	 * <li>1 ERROR</li>
	 * <li>2 WARN</li>
	 * <li>3 INFO</li>
	 * <li>4 LOG</li>
	 * </ul>
	 * @param {number|string} [lvl] Nivel de depuración. Si no se indica solo se retorna el nivel actual
	 * @example
	 * debug.level(2); // ambas sentencias establecen el nivel a 2 (WARN)
	 * debug.level("WARN");
	 * debug.console.log("Example"); // este mensaje no se ve
	 * debug.console.error(""); // este mensaje sí se ve
	 */
	debug.level = function (lvl, sm, sl, sf) {
		if (lvl === undefined) return level;

		level = getLevel(lvl);
		if (arguments.length === 2) { // level(2, true)
			active = showModule = showLine = showFunction = sm;
		} else {
			if (sm !== undefined) showModule = sm;
			if (sl !== undefined) showLine = sl;
			if (sf !== undefined) showFunction = sf;
			active = showModule || showLine || showFunction;
		}

		generateConsole();
		if (isNode) {
			global.console = console;
		} else {
			window.console = console;
		}

		return level;
	};

	/**
	 * Objeto consola que filtra los mensajes por nivel.<br />
	 * Este objeto console funciona igual que el console de sistema.<br />
	 * En Browser utiliza la consola del navegador.<br />
	 * En NodeJS utiliza la consola de sistema, coloreando la salida y los mensajes pueden ser guardados en archivo de log.</br>
	 * @example
	 * debug.console.log("Hello");
	 */
	var console = debug.console = {};
	for (let f in original) console[f] = original[f]; // inicialmente hereda todas las propiedades

	var message = null; //función que muestra un mensage de depuración

	function generateConsole() { // regenera la consola
		for (let l in levels) {
			if (!levels[l].method) continue;
			if (active || isNode) {
				console[l] = message.bind(console, levels[l]);
			} else {
				console[l] = levels[l].level <= level ? original[l] : function () { };
			}
		}
	}

	if (isNode) { // NodeJS
		let commands = { // comandos de texto
			reset: "\x1b[0m",
			bright: "\x1b[1m",
			dim: "\x1b[2m",
			underscore: "\x1b[4m",
			blink: "\x1b[5m",
			reverse: "\x1b[7m",
			hidden: "\x1b[8m"
		};

		let colors = { // colores de texto y fondo
			black: { fg: "\x1b[30m", bg: "\x1b[40m" },
			red: { fg: "\x1b[31m", bg: "\x1b[41m" },
			green: { fg: "\x1b[32m", bg: "\x1b[42m" },
			yellow: { fg: "\x1b[33m", bg: "\x1b[43m" },
			blue: { fg: "\x1b[34m", bg: "\x1b[44m" },
			magenta: { fg: "\x1b[35m", bg: "\x1b[45m" },
			cyan: { fg: "\x1b[36m", bg: "\x1b[46m" },
			white: { fg: "\x1b[37m", bg: "\x1b[47m" }
		};

		// Funciones de texto
		let textAlign = function (txt, n, esp, align, nocut) { // ajusta un texto a un tamaño. Rellena con un caracter o recorta
			txt += "";
			var l = txt.length;
			if (l == n) return txt;
			if (l > n) { // el texto es más grande
				if (nocut) return txt; // no hacer nada
				let c = 0;
				if (align >= 0) c = l - n; // si es center o right, calcular que quitar por izq
				if (!align) c = Math.floor(c / 2); // center es la mitad
				if (c) txt = txt.substr(c); // quitar por la izq
				return txt.substr(0, n); // quitar por la der?
			}
			// Rellenar
			if (!esp) esp = " ";

			// Izq
			var x = 0;
			if (align >= 0) x = n - l;
			if (!align) x = Math.floor(x / 2);
			for (let i = 0; i < x; i++)  txt = esp + txt;

			// Der
			x = 0;
			if (align <= 0) x = n - l;
			if (!align) x = Math.ceil(x / 2);
			for (let i = 0; i < x; i++)  txt = txt + esp;

			return txt;
		}
		let left = textAlign.left = function (txt, n, esp, nocut) { return textAlign(txt, n, esp, -1, nocut); }; // texto a la izq
		let center = textAlign.center = function (txt, n, esp, nocut) { return textAlign(txt, n, esp, 0, nocut); }; // texto centrado
		let right = textAlign.right = function (txt, n, esp, nocut) { return textAlign(txt, n, esp, 1, nocut); }; // texto a la der

		// Funciones de fecha
		function date(date, sep) { if (!sep) sep = "-"; return date.getFullYear() + sep + right(date.getMonth() + 1, 2, "0") + sep + right(date.getDate(), 2, "0"); };
		function time(time, sep) { if (!sep) sep = ":"; return right(time.getHours(), 2, "0") + sep + right(time.getMinutes(), 2, "0") + sep + right(time.getSeconds(), 2, "0"); };
		function datetime(dt, sepD, sepT, sep) { return date(dt, sepD) + (sep === undefined ? " " : sep) + time(dt, sepT); }

		// Funcion que colorea un dato
		function color(obj, max, strColor) {
			if (max <= 0) return { text: "", size: 0 };

			function dots(n) {
				return colors.red.fg + left("", n, ".");
			}

			if (obj === undefined) return color("undefined", max, colors.yellow.fg);
			if (obj === null) return color("null", max, colors.yellow.fg);
			if (obj === true) return color("true", max, colors.yellow.fg);
			if (obj === false) return color("false", max, colors.yellow.fg);
			if (typeof obj === "function") return color("function", max, colors.yellow.fg);
			if (typeof obj === "number") return color("" + obj, max, colors.cyan.fg);

			if (typeof obj === "string") {
				if (!strColor) strColor = colors.white.fg;
				if (obj.length > max) {
					obj = left(obj, max - 3);
					return { text: strColor + obj + dots(max - obj.length), size: max };
				} else {
					return { text: strColor + obj, size: obj.length };
				}
			}

			var out = { text: "", size: 0 };
			if (Array.isArray(obj)) {
				if (max < 2) return { text: dots(max), size: max };
				max -= 2;
				out.size += 2;
				out.text += colors.cyan.fg + "[";
				for (let i = 0; i < obj.length && max > 0; i++) {
					if (i) {
						out.text += colors.cyan.fg + ",";
						out.size++;
						max--;
					}
					let sub = color(obj[i], max, colors.green.fg);
					out.text += sub.text;
					out.size += sub.size;
					max -= sub.size;
				};
				out.text += colors.cyan.fg + "]";
			} else {
				if (max < 2) return { text: dots(max), size: max };
				max -= 2;
				out.size += 2;
				out.text += colors.cyan.fg + "{";
				let next = false;
				for (let p in obj) {
					if (max <= 0) break;

					if (next) {
						out.text += colors.cyan.fg + ",";
						out.size++;
						max--;
					}
					next = true;
					let sub = color(p, max);
					out.text += sub.text;
					out.size += sub.size;
					max -= sub.size;
					if (max < 0) break;
					out.text += colors.cyan.fg + ":";
					out.size++;
					max--;
					sub = color(obj[p], max, colors.green.fg);
					out.text += sub.text;
					out.size += sub.size;
					max -= sub.size;
				};
				out.text += colors.cyan.fg + "}";
			}
			return out;
		}

		// Configuracion general
		var logFileName = null; // name for file logs
		var logFileLevel = levels.none.level; // level for file logs
		var fs = isNode ? require("fs") : null; // acceso a FS

		// Muestra un mensaje por pantalla y/o guarda en archivo, en función del level y el mod
		message = function (lvl, ...args) {
			if (lvl.level <= level) { // message to screen
				let modl = "?", fnct = "?", line = "?";
				if (active) {
					// Obtener datos de depuración
					let track = (new Error()).stack.split("\n")[2];
					let x = /^\s+at ([^\(]+) \(.+[\\/](\w+).js:(\d+):(\d+)\)$/.exec(track);
					if (x) { // formato con función: at FUNCTION (MODULE:LINE:COLUMN)
						fnct = x[1];
						modl = x[2];
						line = x[3];
					} else { // formato sin función : at MODULE:LINE:COLUMN
						x = /^\s+at .+[\\/](\w+).js:(\d+):(\d+)$/.exec(track);
						if (x) {
							modl = x[1];
							line = x[2];
							fnct = "";
						} else {
							original.log("--------------", track);
						}
					}
				}

				let txt = "";
				let size = process.stdout.columns - 1;
				if (showModule) {
					if (Number.isFinite(showModule)) modl = left(modl, showModule)
					txt += colors[lvl.color].fg + modl + " ";
					size -= modl.length + 1;
				}
				if (showLine) {
					if (Number.isFinite(showLine)) line = right(line, showLine);
					txt += colors[lvl.color].fg + line + " ";
					size -= line.length + 1;
				}
				if (showFunction) {
					if (Number.isFinite(showFunction)) fnct = left(fnct, showFunction);
					txt += colors[lvl.color].fg + fnct + " ";
					size -= fnct.length + 1;
				}
				args.forEach((x, i) => {
					if (i) { txt += " "; size--; }
					x = color(x, Math.floor(size / (args.length - i)));
					size -= x.size;
					txt += x.text;
				});
				original.log(txt + commands.reset);
			}

			if (lvl.level <= logFileLevel && logFileName) { // message to file
				let a = datetime(new Date());
				a += "|" + lvl.label;
				a += "|" + args.map((x) => JSON.stringify(x)).join(" ");
				a += "\r\n";
				try {
					fs.appendFileSync(logFileName, a);
				} catch (err) {
					logFileLevel = levels.LVL_NONE;
					original.warn("Error: Can't access log file: '" + logFileName + "'. Log to file is now OFF.", err);
				}
			}
		}

		/**
		 * Configura el log en archivo (Sólo en NodeJS).<br />
		 * Todos los mensajes que complan el nivel de log serán almacenado en archivos de log.
		 * @param {string|number} level Nivel de log
		 * @param {string} name Nombre base del archivo (usa {{date}} para incluir la fecha)
		*/
		debug.logFile = function (level, name) {
			if (level !== undefined) {
				logFileLevel = getLevel(level);
			}
			if (name !== undefined) {
				let now = new Date();
				logFileName = name.replace("{{date}}", date(now, "_")).replace("{{time}}", time(now, "_")).replace("{{datetime}}", datetime(now, "_", "_", "_"));
			}
			return { level: logFileLevel, name: logFileName };
		};


		/**
		 * Permite realizar una salida independiente del nivel (Sólo NodeJS).<br />
		 * Los argumentos alternan formato con texto.<br />
		 * El formato tiene la sintaxis: textColor/backgroundColor/left|center|right/size.
		 * @example
		 * debug.out("red", "Example"); // show Example in red
		 * debug.out("red/white", "Example"); // show Example in red with background in white
		 * debug.out("blue/right/10", "Example"); // show the blue string: "   Example"
		 */
		debug.out = function (...args) {
			var out = "";
			for (let i = 0; i < args.length; i += 2) {
				let p = args[i].split("/");
				var bg = false;
				for (let j = 0; j < p.length; j++) {
					if (colors[p[j]]) {
						out += colors[p[j]][bg ? "bg" : "fg"];
						bg = true;
						continue;
					}
					if (p[j] === "left" || p[j] === "right" || p[j] === "center") {
						//console.log("----", p[j], p[j + 1])
						args[i + 1] = textAlign[p[j]](args[i + 1], p[++j], " ", true);
					}
				}
				out += args[i + 1];
			};
			original.log(out + commands.reset);
		};
		module.exports = debug;
	} else { // Browser
		/*
		var original = debug.original = window.console; // objeto console original
		let modules = {};
		debug.console = function (module, lvl) {
			function wrap(method) {
				modules[module].console[method] = original[method].bind(original, "[" + module + "]");
			}
			if (!modules[module]) { // si aun no existe crear modulo
				modules[module] = { level: Infinity, console: {} };
				for (let m in original) if (typeof original[m] === "function") modules[module].console[m] = original[m].bind(original);
				if (!isNode) {
					wrap("group");
					wrap("groupCollapsed");
				}
			}
			if (lvl !== undefined) { // si se ha indicado un level establecer
				lvl = getLevel(lvl);
				modules[module].level = lvl;
				lvl = Math.min(lvl, debug.level())
			} else {
				lvl = level;
			}
			for (let l in levels) {
				if (!levels[l].method) continue;
				modules[module].console[l] = levels[l].level <= lvl ? original[levels[l].method].bind(original, "[" + module + "]") : function () { };
			}
			return modules[module].console;
		}
		window.debug = debug;
		*/
	}
})(typeof module !== 'undefined' && module.exports);