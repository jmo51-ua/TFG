// tests/myModule.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import myModule from '../src/services/myModule';

describe('Funciones cargarJugadores y cargarDatosCompletosJugadores', () => {
  let consoleErrorSpy;

    beforeEach(() => {
        vi.clearAllMocks();
        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('cargarJugadores - debería cargar jugadores correctamente', async () => {
        const mockActoresResponse = [
            { Actor_idActor: 1, ActorType_idActorType: 2, Organization_has_Category_Organization_idOrganization: 1 },
            { Actor_idActor: 2, ActorType_idActorType: 2, Organization_has_Category_Organization_idOrganization: 1 }
        ];

        myModule.dao.actor_has_actortype.read.mockResolvedValue(mockActoresResponse);
        myModule.dao.actor.read.mockResolvedValue({ idActor: 1, name: 'Jugador 1' });

        await myModule.cargarJugadores();

        expect(myModule.dao.actor_has_actortype.read).toHaveBeenCalledTimes(1);
        expect(myModule.actores).toEqual(mockActoresResponse);
        expect(myModule.actorIds).toEqual([1, 2]);
        expect(myModule.dao.actor.read).toHaveBeenCalledTimes(2);
    });

    it('cargarDatosCompletosJugadores - debería cargar datos completos de los jugadores correctamente', async () => {
        myModule.actorIds = [1, 2];
        const mockActorResponse = { idActor: 1, name: 'Jugador 1' };

        myModule.dao.actor.read.mockResolvedValue(mockActorResponse);

        await myModule.cargarDatosCompletosJugadores();

        expect(myModule.dao.actor.read).toHaveBeenCalledTimes(2);
        expect(myModule.actoresCompletos).toEqual([mockActorResponse, mockActorResponse]);
    });

    it('cargarJugadores - debería manejar el caso cuando no hay teamSelectedID', async () => {
        myModule.teamSelectedID = null;

        await myModule.cargarJugadores();

        expect(console.error).toHaveBeenCalledWith('No team selected');
    });
});
