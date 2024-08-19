import { Test, TestingModule } from '@nestjs/testing';
import { LifeController } from './life.controller';
import { LifeService } from './life.service';

describe('LifeController', () => {
  const mockLifeService = {
    createCountDown: jest.fn().mockResolvedValue({})
  }
  let controller: LifeController;
  let service: LifeService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LifeController],
      providers: [{
        provide: LifeService,
        useValue: mockLifeService
      }],
    }).compile();

    controller = module.get<LifeController>(LifeController);
    service = module.get<LifeService>(LifeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('service should be called', async () => {
    const lifeObject = {
      name: 'Pick',
      dateOfBirth: new Date('1988-08-01'),
      expectSurviveAge: 20
    };
    await controller.create(lifeObject);
    expect(service.createCountDown).toHaveBeenCalled();
  });
});
