import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppResponseDto } from './app.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiCreatedResponse({
    type: AppResponseDto,
    description: 'message'
  })
  getHello(): AppResponseDto {
    return {
      message: this.appService.getHello(),
    };
  }
}
