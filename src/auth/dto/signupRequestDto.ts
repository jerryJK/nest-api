import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignupRequestDto {
  @Field() readonly firstName: string;
  @Field() readonly lastName: string;
  @Field() readonly password: string;
  @Field() readonly email: string;
}
