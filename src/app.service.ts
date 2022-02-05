import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
type NameHolder = { name: string; url: string };
type MoveHolder = { move: NameHolder };
type Moves = { moves: Array<MoveHolder> };
@Injectable()
export class AppService {
    constructor(private httpService: HttpService) {}
    getPokeAttack(id: string): Observable<{ name: string }> {
        const randomIndex = Math.floor(Math.random() * 4);
        const moveNames = this.httpService
            .get<Moves>('https://pokeapi.co/api/v2/pokemon/' + id)
            .pipe(map((res) => res.data.moves[randomIndex].move));
        return moveNames;
    }
}
