import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsPositive, IsString , isISO8601} from 'class-validator';

export class LifeRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsDate()
  dateOfBirth: Date;
  @IsOptional()
  @IsPositive()
  expectSurviveAge?: number = 75;
}
export class LifeRequestInputDto {
  @ApiProperty({
    type: String,
    description: 'user name'
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    type: String,
    description: 'date of birth'
  })
  @Transform(({ value }) => {
    const isValidDate = isISO8601(value, { strict: true, strictSeparator: true });
    if (!isValidDate) {
      throw new BadRequestException(`Property "dateOfBirth" should be a valid ISO8601 date string`);
    }
    return new Date(value);
  })
  @IsNotEmpty()
  dateOfBirth: Date;
  @ApiProperty({
    type: Number,
    description: 'expected survive age'
  })
  @IsOptional()
  @IsPositive()
  expectSurviveAge?: number = 75;
}

export class LifeResponseDto {
  @ApiProperty({
    type: String,
    description: 'user name'
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    type: Date,
    description: 'date of birth'
  })
  @IsDate()
  dateOfBirth: Date;
  @ApiProperty({
    type: Number,
    description: 'expected survived age'
  })
  @IsPositive()
  expectSurviveAge?: number = 75;
  @ApiProperty({
    type: Number,
    description: 'current age'
  })
  @IsPositive()
  currentAge: number;
}

export class DeadResposeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsDate()
  dateOfBirth: Date;
  @IsDate()
  dateOfDead: Date;
}