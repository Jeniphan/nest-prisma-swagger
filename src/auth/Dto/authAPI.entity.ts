import { ApiProperty } from '@nestjs/swagger';

export class userEntity {
  id: number | null;
  @ApiProperty()
  username: string;
  @ApiProperty()
  pass: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
}

export class userSignInEntity {
  @ApiProperty()
  username: string;
  @ApiProperty()
  pass: string;
}
