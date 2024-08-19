import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCountDownEvent {
  @IsString()
  @IsNotEmpty()
  user: string;
  @IsPositive()
  expectSurviveAge: number;
  @IsDate()
  dateOfBirth: Date;
}

export class UpdateCountDownEvent {
  @IsString()
  @IsNotEmpty()
  user: string;
  @IsPositive()
  expectSurviveAge: number;
  @IsDate()
  dateOfBirth: Date;
  @IsNumber()
  remainYearToLive: number;
}

export class StopJobEvent {
  @IsString()
  name: string;
}