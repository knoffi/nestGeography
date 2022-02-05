import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
    constructor(private httpService: HttpService) {}
    getPokeAttack(id: string) {
        return this.httpService
            .get('https://pokeapi.co/api/v2/pokemon/' + id)
            .pipe(map((res) => res.data.name));
    }
}
