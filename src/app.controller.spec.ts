import { AppController } from './app.controller';
import { AppServiceMock } from './app.service.mock';

describe('AppController', () => {
    const appService = new AppServiceMock();
    const appController = new AppController(appService);

    describe('app controller', () => {
        it('id test for empty string', () => {
            console.log(appController.testPokemonId(''));
            expect(appController.testPokemonId('')).toEqual('no number');
        });
        it('id test for invalid number', () => {
            expect(appController.testPokemonId('999999')).toEqual(
                'out of range'
            );
        });
        it('id test for 0', () => {
            expect(appController.testPokemonId('0')).toEqual('out of range');
        });
        it('id test for valid number', () => {
            expect(appController.testPokemonId('150')).toEqual('valid');
        });
    });
});
