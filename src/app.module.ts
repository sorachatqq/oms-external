import { Module } from '@nestjs/common';
import { OilMovementModule } from './oil-movement/oil-movement.module';

@Module({
  imports: [OilMovementModule],
})
export class AppModule {}
