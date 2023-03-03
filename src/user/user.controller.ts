/* eslint-disable prettier/prettier */
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/user/decorator/roles.decorator';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Role } from './entities/role.enum';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMINISTRATOR)
  async findAll(@Req() req) {
    return this.userService.findAll();
  }
}
