import { HttpException } from '@nestjs/common';
import { AppController } from './poke.controller';
import { AppServiceMock } from './poke.service.mock';

// needs in package.json:   "jest:": {"restoreMocks":true}, otherwise reset spys with beforeEach(...)
describe('PokeController', () => {
    const appService = new AppServiceMock();
    const appController = new AppController(appService);
    describe('id validation', () => {
        it('for empty string', () => {
            expect(appController.testPokemonId('')).toEqual('no number');
        });
        it('for invalid number', () => {
            expect(appController.testPokemonId('999999')).toEqual(
                'out of range'
            );
        });
        it('for 0', () => {
            expect(appController.testPokemonId('0')).toEqual('out of range');
        });
        it('for valid number', () => {
            expect(appController.testPokemonId('150')).toEqual('valid');
        });
    });
    describe('response', () => {
        it('valid id', async () => {
            const spy = jest.spyOn(AppController.prototype, 'testPokemonId');
            const body = await appController.getPokeName('150');
            expect(body).toHaveProperty('name');
            expect(body).toHaveProperty('url');
            expect(spy).toBeCalled();
        });
        it('no number id', async () => {
            const errorTest = async () =>
                await appController.getPokeName('fourtytwo');
            expect(errorTest).rejects.toThrowError(HttpException);
            try {
                await errorTest();
            } catch (error) {
                expect(error.message).toBe('Poke id must be an integer');
            }
        });
        it('id out of range', async () => {
            const errorTest = async () =>
                await appController.getPokeName('9999999999999');
            expect(errorTest).rejects.toThrowError(HttpException);
            try {
                await errorTest();
            } catch (error) {
                expect(error.message).toMatch('Poke id must be between 1 and');
            }
        });
    });
});
