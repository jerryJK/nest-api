import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetUserResponseDto {
  @Field() id: string;
  @Field() firstName: string;
  @Field() lastName: string;
  @Field() email: string;
  @Field() confirmed: boolean;
}
