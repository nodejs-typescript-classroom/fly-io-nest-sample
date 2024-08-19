import { IsBoolean, IsDate, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CountDownModel {
  @IsString()
  @IsNotEmpty()
  user: string;
  @IsDate()
  dateOfBirth: Date;
  @IsPositive()
  remainYearToLive: number;
  @IsPositive()
  expectSurviveAge: number;
}