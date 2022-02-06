import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GeographyController } from './geography.controller';

@Module({ controllers: [GeographyController], imports: [HttpModule] })
export class GeographyModule {}
