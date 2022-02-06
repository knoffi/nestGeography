import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
export type NameHolder = { name: string; url: string };
type MoveHolder = { move: NameHolder };
type Moves = { moves: Array<MoveHolder> };
@Injectable()
export class AppService {
    constructor(private httpService: HttpService) {}
    private static readonly DEFAULT_MOVE = {
        move: {
            name: 'struggle',
            url: 'https://pokeapi.co/api/v2/move/struggle/',
        },
    };

    async getPokeAttack(id: string): Promise<NameHolder> {
        try {
            const moveNames = await firstValueFrom(
                this.httpService
                    .get<Moves>('https://pokeapi.co/api/v2/pokemon/' + id)
                    .pipe(map((res) => res.data.moves))
            );
            return this.randomEntry(moveNames, AppService.DEFAULT_MOVE).move;
        } catch (error) {
            console.log(error);
        }
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
