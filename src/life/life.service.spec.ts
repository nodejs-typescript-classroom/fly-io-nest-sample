import { Test, TestingModule } from '@nestjs/testing';
import { LifeService } from './life.service';
import { CurrentTimeService } from './currenttime.service';
import { BadRequestException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('LifeService', () => {
  let service: LifeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifeService, {
        provide: CurrentTimeService,
        useValue:{
            now: () => new Date('2024-08-19')
        },
      }, EventEmitter2,
      ],
    }).compile();

    service = module.get<LifeService>(LifeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return create counter job object', () => {
    const lifeObject = {
      name: 'Eddie',
      dateOfBirth: new Date('1988-08-01'),
      expectSurviveAge: 75
    };
    expect(service.createCountDown(lifeObject)).resolves.toEqual(
      {
        name: 'Eddie',
        dateOfBirth: new Date('1988-08-01'),
        currentAge: 36,
        expectSurviveAge: 75
      }           
    )
  });
  it('should return create already died', () => {
    const lifeObject = {
      name: 'Pick',
      dateOfBirth: new Date('1988-08-01'),
      expectSurviveAge: 20
    };
    expect(service.createCountDown(lifeObject)).rejects.toThrow(new BadRequestException({
      message: `This guy is already dead`,
      currentAge: 36,
      expectSurviveAge: 20,
      dateOfBirth: new Date('1988-08-01'),
    }));
  });
});
