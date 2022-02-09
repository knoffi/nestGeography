import { Controller, Get, Inject, Param } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { IPokeService, NameHolder } from './poke.service';
export class PokeId {
    private static readonly MAX_POKEMON_ID = 10220;
    @IsInt()
    @Type(() => Number)
    @Min(1)
    @Max(PokeId.MAX_POKEMON_ID)
    id: number;
    constructor(id: number) {
        this.id = id;
    }
}

@Controller('pokemon')
export class PokeController {
    constructor(
        @Inject('IPokeService') private readonly service: IPokeService
    ) {}
    @Get(':id')
    async getPokeName(@Param() params: PokeId): Promise<NameHolder> {
        return this.service.getPokeAttack('' + params.id);
    }
}
