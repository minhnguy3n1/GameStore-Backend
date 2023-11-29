/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { Roles } from 'src/user/decorator/roles.decorator';
import { Role } from './entities/role.enum';
import { RoleGuard } from './guards/roles.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private fileService: FileService,
  ) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMINISTRATOR)
  async findAll() {
    return this.userService.findAll();
  }

  @Post('add-many')
  async createManyUsers(@Body() users) {
    return await this.userService.createManyUser(users);
  }

  @Delete('delete-all')
  async deleteManyUsers() {
    return await this.userService.deleteAllUsers();
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('avatar'))
  async createUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() createUserInput,
  ) {

    const user = JSON.parse(createUserInput.data);
    if (avatar) {
      user.avatarUrl = await this.fileService.uploadPublicFile(avatar);
    }

    return this.userService.createUser(user);
  }

  @Put('update-user')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUser(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() updateUserInput,
  ) {
    const user = JSON.parse(updateUserInput.data);
    if (avatar) {
      user.avatarUrl = await this.fileService.uploadPublicFile(avatar);
    }
    
    return this.userService.updateUser(user);
  }

  @Delete(':id')
  async deleteOneUser(@Param('id', ParseIntPipe) userId) {
    return await this.userService.deleteUserById(userId);
  }
}
