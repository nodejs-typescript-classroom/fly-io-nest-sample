import { BadRequestException, Inject, Injectable, Logger, LoggerService, UsePipes, ValidationPipe } from '@nestjs/common';
import { DeadResposeDto, LifeRequestDto, LifeResponseDto } from './life.dto';
import { CurrentTimeService } from './currenttime.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateCountDownEvent, UpdateCountDownEvent } from './countdown.event';

@Injectable()
export class LifeService {
  private readonly logger: LoggerService = new Logger(LifeService.name);
  cacheCountDownHistory: LifeRequestDto[] = new Array<LifeRequestDto>(10);
  cacheDeadHistory: DeadResposeDto[] = new Array<DeadResposeDto>(10);
  storeLivePos: number= 0;
  storeDeadPos: number= 0;
  constructor(
    private readonly currentTimeService: CurrentTimeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  async createCountDown(lifeObject: LifeRequestDto): Promise<LifeResponseDto> {
    // calculate current age
    const now = this.currentTimeService.now();
    const currentAge = now.getFullYear() - lifeObject.dateOfBirth.getFullYear();
    
    const expectSurviveAge = lifeObject.expectSurviveAge? lifeObject.expectSurviveAge: 75;
    if (currentAge < 0 || lifeObject.dateOfBirth.getTime() > now.getTime() ) {
      throw new BadRequestException({
        message: `This guy is has not been born`,
        currentAge: currentAge,
        expectSurviveAge: expectSurviveAge,
        dateOfBirth: lifeObject.dateOfBirth,
      });
    }
    if (currentAge > expectSurviveAge) {
      throw new BadRequestException({
        message: `This guy is already dead`,
        currentAge: currentAge,
        expectSurviveAge: expectSurviveAge,
        dateOfBirth: lifeObject.dateOfBirth,
      });
    }
    // add object into history
    this.cacheCountDownHistory[this.storeLivePos] = lifeObject;
    this.storeLivePos =  (this.storeLivePos+1)%10;
    // dispatch create count down event
    const createCountdownEvent =  new CreateCountDownEvent();
    createCountdownEvent.dateOfBirth = lifeObject.dateOfBirth;
    createCountdownEvent.user = lifeObject.name;
    createCountdownEvent.expectSurviveAge = expectSurviveAge;
    this.eventEmitter.emitAsync('create.count.down', createCountdownEvent);
    const result = new LifeResponseDto();
    result.name = lifeObject.name;
    result.expectSurviveAge = expectSurviveAge;
    result.dateOfBirth = lifeObject.dateOfBirth;
    result.currentAge = currentAge;
    return result;
  }
  @OnEvent('remove.count.down', { async: true })
  @UsePipes(ValidationPipe)
  cacheDeathPerson(payload: UpdateCountDownEvent){
    this.logger.log('dead event', payload);
    const deadRecord = new DeadResposeDto();
    deadRecord.dateOfBirth = payload.dateOfBirth;
    deadRecord.name = payload.user;
    deadRecord.dateOfDead = this.currentTimeService.now();
    this.cacheDeadHistory[this.storeDeadPos] = deadRecord;
    this.storeDeadPos = (this.storeDeadPos+1)%10;
  }
}
