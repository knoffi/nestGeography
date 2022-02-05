import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

export type Attack = { attack: string };
@Injectable()
export class AppService {
    constructor(private httpService: HttpService) {}
    getPokeAttack(): Attack {
        return { attack: 'random attack' };
    }
}
