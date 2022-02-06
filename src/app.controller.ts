import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
} from '@nestjs/common';
import { IAppService, NameHolder } from './app.service';

@Controller()
export class AppController {
    private static readonly MAX_POKEMON_ID = 10220;
    constructor(
        @Inject('IAppService') private readonly appService: IAppService
    ) {}
    @Get(':id')
    async getPokeName(@Param('id') id: string): Promise<NameHolder> {
        switch (this.testPokemonId(id)) {
            case 'valid':
                return await this.appService.getPokeAttack(id);
            case 'no number':
                throw new HttpException(
                    'Poke id must be an integer',
                    HttpStatus.BAD_REQUEST
                );
            case 'out of range':
                throw new HttpException(
                    'Poke id must be between 1 and ' +
                        AppController.MAX_POKEMON_ID,
                    HttpStatus.BAD_REQUEST
                );

            default:
                throw new HttpException(
                    'Unknown error',
                    HttpStatus.BAD_REQUEST
                );
        }
    }

    testPokemonId(id: string): 'valid' | 'no number' | 'out of range' {
        const withoutNumbers = id.replace(/\d/g, '');
        const isNoNumber = withoutNumbers.length > 0;
        const isEmpyString = id.length === 0;
        if (isNoNumber || isEmpyString) {
            return 'no number';
        } else {
            const idNumber = parseInt(id);
            const idInRange =
                0 < idNumber && idNumber <= AppController.MAX_POKEMON_ID;
            if (idInRange) {
                return 'valid';
            } else {
                return 'out of range';
            }
        }
    }
}
