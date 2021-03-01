import { Field, ObjectType } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';

@ObjectType()
export class LoginResponseDto {
  @Field() readonly status: HttpStatus;
  @Field() readonly token: string;
}
