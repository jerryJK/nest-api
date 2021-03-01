import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput } from './input/signupInput';
import { LoginResponseDto } from './dto/loginResponseDto';
import { LoginInput } from './input/loginInput';
import { HttpStatusResponse } from '../shared/httpStatusResponse';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => HttpStatusResponse)
  async signup(@Args('data') data: SignupInput) {
    return this.authService.signup(data);
  }

  @Mutation(() => LoginResponseDto)
  async login(@Args('data') data: LoginInput) {
    return this.authService.login(data);
  }

  @Mutation(() => HttpStatusResponse)
  async resendConfirmationEmail(@Args('email') email: string) {
    return this.authService.resendConfirmationLink(email);
  }
}
