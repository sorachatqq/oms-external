import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OilMovementController } from './oil-movement.controller';
import { OilMovementService } from './oil-movement.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
    }),
  ],
  controllers: [OilMovementController],
  providers: [OilMovementService],
  exports: [OilMovementService],
})
export class OilMovementModule {}
