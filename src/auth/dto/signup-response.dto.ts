import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SignupResponse {
  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  phone: string;

  @Field()
  companyName: string;
}
