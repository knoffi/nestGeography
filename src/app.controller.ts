import { Controller, Get, Param } from '@nestjs/common';
import { AppService, NameHolder } from './app.service';

@Controller()
export class AppController {
    private static readonly MAX_POKEMON_ID = 10220;
    constructor(private readonly appService: AppService) {}
    @Get(':id')
    async getPokeName(@Param() params): Promise<NameHolder> {
        if (this.testPokemonId(params.id)) {
            return await this.appService.getPokeAttack(params.id);
        }
        return {
            name:
                'No valid pokemon id! Id needs to be an integer between 1 and ' +
                AppController.MAX_POKEMON_ID,
            url: '',
        };
    }

    testPokemonId(id: string): boolean {
        return true;
    }
}
