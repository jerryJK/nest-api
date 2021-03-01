import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gqlAuthQuard';
import { CurrentUser } from './decorator/currentUser';
import { GetUserResponseDto } from './dto/getUserResponseDto';

@Resolver(of => UserEntity)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [GetUserResponseDto])
  @UseGuards(GqlAuthGuard)
  async users() {
    return this.userService.getUsers();
  }

  @Query(() => GetUserResponseDto)
  @UseGuards(GqlAuthGuard)
  async user(@Args('id') id: string) {
    return this.userService.getUser(id);
  }

  @Query(() => GetUserResponseDto)
  @UseGuards(GqlAuthGuard)
  async currentUser(@CurrentUser() user: GetUserResponseDto) {
    return this.userService.getUser(user.id);
  }
}
