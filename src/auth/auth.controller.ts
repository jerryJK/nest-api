import { Controller, Get, Param, Response } from '@nestjs/common';
import { Response as Res } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('confirm/:id')
  async confirmEmail(@Param('id') id: string, @Response() res: Res) {
    try {
      await this.authService.confirmEmail(id);
      res.render('emailConfirmationSuccessPage');
    } catch {
      res.render('emailConfirmationFailurePage');
    }
  }
}
