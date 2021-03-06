import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field() readonly firstName: string;
  @Field() readonly lastName: string;
  @Field() readonly password: string;
  @Field() readonly email: string;
}
