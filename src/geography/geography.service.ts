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
    async getCurrency(): Promise<CountryHolder> {
        try {
            const res = await firstValueFrom(
                this.http
                    .post<Response>('https://countries.trevorblades.com/', {
                        query: "query{country(code:'DE'){currency,capital,name} }",
                    })
                    .pipe(map((res) => res.data))
            );
            return res.data;
        } catch (error) {
            console.log(JSON.stringify(error));
        }
    }
}
