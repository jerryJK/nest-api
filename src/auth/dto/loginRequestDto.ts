import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginRequestDto {
  @Field() readonly email: string;
  @Field() readonly password: string;
}
