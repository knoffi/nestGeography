import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GeographyController } from './geography.controller';
import { GeographyService } from './geography.service';

@Module({
    controllers: [GeographyController],
    imports: [HttpModule],
    providers: [{ provide: 'IGeographyService', useClass: GeographyService }],
})
export class GeographyModule {}
