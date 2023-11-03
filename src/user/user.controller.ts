import {
  Controller,
  UseGuards,
  Post,
  Request,
  Get,
  Body,
  Response,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserProps } from './user.interface';
import { responseError, responseSuccess } from 'src/util/response';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() body: UserProps, @Response() response: any) {
    try {
      const data = await this.userService.create(body);
      responseSuccess(response, data);
    } catch (error) {
      responseError(response, error);
    }
  }

  @Get()
  async getAll(@Request() req: any, @Response() response: any) {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 10;

      const data = await this.userService.getAll(page, pageSize);
      responseSuccess(response, data);
    } catch (error) {
      responseError(response);
    }
  }

  @Put('reset-senha/:login')
  async updatePasswordLogin(@Request() req: any, @Response() response: any) {
    try {
      const data = await this.userService.updatePasswordLogin(
        req.headers.login,
        req.body,
      );
      responseSuccess(response, data);
    } catch (error) {
      responseError(response);
    }
  }
}
