/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from './entities/role.enum';
import { RoleGuard } from './guards/roles.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMINISTRATOR)
  async findAll() {
    return this.userService.findAll();
  }
}
