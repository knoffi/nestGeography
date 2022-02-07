import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
} from '@nestjs/common';
import { IPokeService, NameHolder } from './poke.service';

@Controller('pokemon')
export class PokeController {
    private static readonly MAX_POKEMON_ID = 10220;
    constructor(
        @Inject('IPokeService') private readonly service: IPokeService
    ) {}
    @Get(':id')
    async getPokeName(@Param('id') id: string): Promise<NameHolder> {
        switch (this.testPokemonId(id)) {
            case 'valid':
                return await this.service.getPokeAttack(id);
            case 'no number':
                throw new HttpException(
                    'Poke id must be an integer',
                    HttpStatus.BAD_REQUEST
                );
            case 'out of range':
                throw new HttpException(
                    'Poke id must be between 1 and ' +
                        PokeController.MAX_POKEMON_ID,
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
                0 < idNumber && idNumber <= PokeController.MAX_POKEMON_ID;
            if (idInRange) {
                return 'valid';
            } else {
                return 'out of range';
            }
        }
    }
}
