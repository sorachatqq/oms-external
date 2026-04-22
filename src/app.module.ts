import { Module } from '@nestjs/common';
import { OilMovementModule } from './oil-movement/oil-movement.module';
import { Nm1Module } from './nm1/nm1.module';

@Module({
  imports: [OilMovementModule, Nm1Module],
})
export class AppModule {}
