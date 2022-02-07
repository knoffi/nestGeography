import { HttpException } from '@nestjs/common';
import { PokeController } from './poke.controller';
import { PokeServiceMock } from './poke.service.mock';

// needs in package.json:   "jest:": {"restoreMocks":true}, otherwise reset spys with beforeEach(...)
describe('PokeController', () => {
    const service = new PokeServiceMock();
    const controller = new PokeController(service);
    describe('id validation', () => {
        it('for empty string', () => {
            expect(controller.testPokemonId('')).toEqual('no number');
        });
        it('for invalid number', () => {
            expect(controller.testPokemonId('999999')).toEqual('out of range');
        });
        it('for 0', () => {
            expect(controller.testPokemonId('0')).toEqual('out of range');
        });
        it('for valid number', () => {
            expect(controller.testPokemonId('150')).toEqual('valid');
        });
    });
    describe('response', () => {
        it('valid id', async () => {
            const spy = jest.spyOn(PokeController.prototype, 'testPokemonId');
            const body = await controller.getPokeName('150');
            expect(body).toHaveProperty('name');
            expect(body).toHaveProperty('url');
            expect(spy).toBeCalled();
        });
        it('no number id', async () => {
            const errorTest = async () =>
                await controller.getPokeName('fourtytwo');
            expect(errorTest).rejects.toThrowError(HttpException);
            try {
                await errorTest();
            } catch (error) {
                expect(error.message).toBe('Poke id must be an integer');
            }
        });
        it('id out of range', async () => {
            const errorTest = async () =>
                await controller.getPokeName('9999999999999');
            expect(errorTest).rejects.toThrowError(HttpException);
            try {
                await errorTest();
            } catch (error) {
                expect(error.message).toMatch('Poke id must be between 1 and');
            }
        });
    });
});
