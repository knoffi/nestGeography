import { Injectable } from '@nestjs/common';

export type HelloWorld = { message: string };
@Injectable()
export class AppService {
    getHello(): HelloWorld {
        return { message: 'Hello My Dear World!' };
    }
}
