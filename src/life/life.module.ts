import { Module } from '@nestjs/common';
import { LifeController } from './life.controller';
import { LifeService } from './life.service';
import { CurrentTimeService } from './currenttime.service';
import { LifeCountDownService } from './lifecountdown.service';
import { CountDownGateway } from './countdown.gateway';

@Module({
  controllers: [LifeController],
  providers: [LifeService, CurrentTimeService, LifeCountDownService, CountDownGateway],
})
export class LifeModule {}
