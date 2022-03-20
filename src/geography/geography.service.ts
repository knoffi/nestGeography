import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
export type CountryHolder = {
    country: { currency: string; capital: string; name: string };
};
type Response = { data: CountryHolder };
export interface IGeographyService {
    getCountry: (id: string) => CountryHolder | Promise<CountryHolder>;
}
@Injectable()
export class GeographyService implements IGeographyService {
    constructor(private readonly http: HttpService) {}
    async getCountry(id: string): Promise<CountryHolder> {
        const graphQLQuery =
            'query{country(code:"' + id + '"){currency,capital,name} }';
        const res = await firstValueFrom(
            this.http
                .post<Response>('https://countries.trevorblades.com/', {
                    query: graphQLQuery,
                })
                .pipe(map((res) => res.data))
        );
        return res.data;
    }
}
