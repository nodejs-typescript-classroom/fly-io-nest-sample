import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppResponseDto } from './app.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    type: AppResponseDto,
    description: 'message',
    status: 200
  })
  getHello(): AppResponseDto {
    return {
      message: this.appService.getHello(),
    };
  }
}
