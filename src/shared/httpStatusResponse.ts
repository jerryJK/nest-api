import { Field, ObjectType } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';

@ObjectType()
export class HttpStatusResponse {
  @Field() readonly status: HttpStatus;
}
