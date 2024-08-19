import { Injectable, Logger, LoggerService, UsePipes, ValidationPipe } from '@nestjs/common';
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CreateCountDownEvent, StopJobEvent } from './countdown.event';
import { CountDownModel } from './countdowan.model';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CronJob } from 'cron';
import { CurrentTimeService } from './currenttime.service';

@Injectable()
export class LifeCountDownService {
  private readonly logger: LoggerService = new Logger(LifeCountDownService.name);
  countDownJobs: Map<string,CountDownModel> =  new Map<string,CountDownModel>();
  constructor(private readonly scheduleRegistry: SchedulerRegistry,
    private readonly eventEmiiter: EventEmitter2,
    private readonly currentTimeService: CurrentTimeService,
    
  ) {}
  @OnEvent('create.count.down', { async: true})
  @UsePipes(ValidationPipe)
  handleOnReceiveNewCountDown(payload: CreateCountDownEvent) {
    // if length of countDownJobs equals to zero mean no job need to create
    const isJobCreated = this.countDownJobs.size != 0;
    const newJob = new CountDownModel();
    newJob.user = payload.user;
    newJob.dateOfBirth = payload.dateOfBirth;
    newJob.expectSurviveAge = payload.expectSurviveAge;
    newJob.remainYearToLive = payload.expectSurviveAge - (this.currentTimeService.now().getFullYear() - payload.dateOfBirth.getFullYear());
    this.countDownJobs.set(newJob.user, newJob);
    if (!isJobCreated) {
      // create job
      const job = new CronJob(CronExpression.EVERY_10_SECONDS, ()=> {    
        for (let value of this.countDownJobs) {
          this.logger.log('cronjob updated');  
          const user = value[0];
          const currentJob = value[1];
          if (currentJob.remainYearToLive > 0) {
            currentJob.remainYearToLive--;
            this.logger.log('update.count.down', currentJob);
          }
          // send update message
          this.eventEmiiter.emitAsync('update.count.down', currentJob);
          if (currentJob.remainYearToLive == 0) {
            this.eventEmiiter.emitAsync('remove.count.down', currentJob);
            this.countDownJobs.delete(user);
          }
        }
        if (this.countDownJobs.size == 0) {
          this.logger.log('remove cron job')
          this.eventEmiiter.emitAsync('remove.cron.job', { name: 'stop cron job'});
        }
      })
      // append to registry
      this.scheduleRegistry.addCronJob('count-down', job);
      job.start();
      this.logger.log('cronjob start');
    }
  }
  @OnEvent('remove.cron.job', { async: true }) 
  @UsePipes(ValidationPipe)
  handleReceiveStopJob(payload: StopJobEvent) {
    this.logger.log('cronjob stop', payload);
    const job = this.scheduleRegistry.getCronJob('count-down');
    job.stop()
    this.scheduleRegistry.deleteCronJob('count-down');
  }
}