import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Nm1Controller } from './nm1.controller';
import { Nm1Service } from './nm1.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
    }),
  ],
  controllers: [Nm1Controller],
  providers: [Nm1Service],
})
export class Nm1Module {}
