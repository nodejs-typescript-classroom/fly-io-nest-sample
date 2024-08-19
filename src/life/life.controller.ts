import { Body, Controller, Post } from '@nestjs/common';
import { LifeService } from './life.service';
import {LifeRequestInputDto, LifeResponseDto } from './life.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('life')
export class LifeController {
  constructor(private readonly lifeService: LifeService) {}
  @ApiCreatedResponse({
    type: LifeResponseDto,
    description: 'response for create'
  })
  @Post()
  async create(@Body() lifeRequest:LifeRequestInputDto) {
    return this.lifeService.createCountDown(lifeRequest);
  }
}
