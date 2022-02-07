import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
export type CountryHolder = {
    country: { currency: string; capital: string; name: string };
};
type Response = { data: CountryHolder };
@Injectable()
export class GeographyService {
    constructor(private readonly http: HttpService) {}
    async getCurrency(id: string): Promise<CountryHolder> {
        try {
            const graphQLQuery =
                'query{country(code:"' + id + '"){currency,capital,name} }';
            console.log(graphQLQuery);
            const res = await firstValueFrom(
                this.http
                    .post<Response>('https://countries.trevorblades.com/', {
                        query: graphQLQuery,
                    })
                    .pipe(map((res) => res.data))
            );
            return res.data;
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }
}
