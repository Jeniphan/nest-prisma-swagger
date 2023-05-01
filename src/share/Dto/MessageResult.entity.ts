import { ApiProperty } from '@nestjs/swagger';

export class MessageResultAPIModel {
  @ApiProperty()
  result: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: any;
}
