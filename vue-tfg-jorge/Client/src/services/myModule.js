// src/services/myModule.js
import { vi } from 'vitest';

const mockDao = {
  actor_has_actortype: {
    read: vi.fn()
  },
  actor: {
    read: vi.fn()
  }
};

const myModule = {
  dao: mockDao,
  teamSelectedID: 1,
  actores: [],
  actorIds: [],
  actoresCompletos: [],
  async cargarJugadores() {
    if (!this.teamSelectedID) {
      console.error('No team selected');
      return;
    }

    try {
      const response = await this.dao.actor_has_actortype.read();
      this.actores = response.filter(actor =>
        actor.ActorType_idActorType === 2 &&
        actor.Organization_has_Category_Organization_idOrganization === this.teamSelectedID
      );
      this.actorIds = this.actores.map(actor => actor.Actor_idActor);
      await this.cargarDatosCompletosJugadores();
    } catch (error) {
      console.error('Error al cargar jugadores:', error);
    }
  },
  async cargarDatosCompletosJugadores() {
    try {
      const promises = this.actorIds.map(id => this.dao.actor.read({ idActor: id }));
      this.actoresCompletos = await Promise.all(promises);
      console.log('Datos completos de los actores:', this.actoresCompletos);
    } catch (error) {
      console.error('Error al cargar jugadores completos:', error);
    }
  }
};

export default myModule;
