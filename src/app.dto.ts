import { ApiProperty } from "@nestjs/swagger";

export class AppResponseDto {
  @ApiProperty({
    type: String,
    description: 'message'
  })
  message: string;
}