import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
export type NameHolder = { name: string; url: string };
type MoveHolder = { move: NameHolder };
type Moves = { moves: Array<MoveHolder> };
export interface IPokeService {
    getPokeAttack: (id: string) => Promise<NameHolder> | NameHolder;
}
@Injectable()
export class PokeService implements IPokeService {
    constructor(private httpService: HttpService) {}
    private static readonly DEFAULT_MOVE = {
        move: {
            name: 'struggle',
            url: 'https://pokeapi.co/api/v2/move/struggle/',
        },
    };

    async getPokeAttack(id: string): Promise<NameHolder> {
        const moveNames = await firstValueFrom<MoveHolder[]>(
            this.httpService
                .get<Moves>('https://pokeapi.co/api/v2/pokemon/' + id)
                .pipe(map((res) => res.data.moves))
        );
        return this.randomEntry(moveNames, PokeService.DEFAULT_MOVE).move;
    }
    randomEntry<T>(array: Array<T>, defaultValue: T): T {
        if (array.length === 0) {
            return defaultValue;
        } else {
            const randomIndex = Math.floor(Math.random() * array.length);
            const randomEntry = array[randomIndex];
            return randomEntry;
        }
    }
}
