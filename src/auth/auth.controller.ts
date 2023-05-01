import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { userEntity, userSignInEntity } from './Dto/authAPI.entity';
import { MessageResultAPIModel } from 'src/share/Dto/MessageResult.entity';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  private messageResultAPI: MessageResultAPIModel;
  constructor(private authService: AuthService) {
    this.messageResultAPI = new MessageResultAPIModel();
  }

  @Post('/signIn')
  @ApiCreatedResponse({ type: MessageResultAPIModel })
  async SignIn(
    @Body() userSignIn: userSignInEntity,
  ): Promise<MessageResultAPIModel> {
    try {
      const results = await this.authService.signIn(
        userSignIn.username,
        userSignIn.pass,
      );
      if (results) {
        this.messageResultAPI.data = results;
        this.messageResultAPI.message = 'success';
        this.messageResultAPI.result = true;
      } else {
        this.messageResultAPI.data = null;
        this.messageResultAPI.message = 'invalid credentials';
        this.messageResultAPI.result = false;
      }

      return this.messageResultAPI;
    } catch (err) {
      this.messageResultAPI.data = err;
      this.messageResultAPI.message = err.message;
      this.messageResultAPI.result = false;
      return this.messageResultAPI;
    }
  }

  @Post('/singUp')
  @ApiCreatedResponse({ type: MessageResultAPIModel })
  async SingUp(@Body() userSignUp: userEntity): Promise<MessageResultAPIModel> {
    try {
      const results = await this.authService.register(userSignUp);
      if (results) {
        this.messageResultAPI.data = results;
        this.messageResultAPI.message = 'success';
        this.messageResultAPI.result = true;
      } else {
        this.messageResultAPI.data = null;
        this.messageResultAPI.message = 'invalid credentials';
        this.messageResultAPI.result = false;
      }

      return this.messageResultAPI;
    } catch (err) {
      this.messageResultAPI.data = err;
      this.messageResultAPI.message = err.message;
      this.messageResultAPI.result = false;
      return this.messageResultAPI;
    }
  }

  @Get('/profile')
  @ApiOkResponse({ type: MessageResultAPIModel })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async GetProfile(
    @Headers('authorization') authHeader: string,
  ): Promise<MessageResultAPIModel> {
    try {
      const token = authHeader.split(' ')[1];

      const result = await this.authService.GetProfile(token);

      if (result) {
        this.messageResultAPI.data = result;
        this.messageResultAPI.message = 'success';
        this.messageResultAPI.result = true;
      } else {
        this.messageResultAPI.data = null;
        this.messageResultAPI.message = 'Somthing went wrong!';
        this.messageResultAPI.result = false;
      }
      return this.messageResultAPI;
    } catch (err) {
      this.messageResultAPI.data = err;
      this.messageResultAPI.message = err.message;
      this.messageResultAPI.result = false;
    }
  }
}
