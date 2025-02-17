import { Controller, Get, Post, Body, Delete, Param, Put, UseInterceptors, UploadedFile, BadRequestException, Res, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateMahasiswadto } from './dto/create-mahasiswa.dto';
import { updatemahasiswaDTO } from './dto/update-mahasiswa.dto';
import { RegisterUserDTO } from './dto/register-user.dto';
import { loginuserDTO } from './dto/login-user.dto';
import { AuthGuard } from './auth.guard';
import { UserDecorator } from './user.decorator';
import { User } from './entity/usere.entity';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
// import { file } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('mahasiswa/search')
  async cariMahasiswa(@Query('nama') nama: string) {
    return this.appService.cariMahasiswa({ nama });
  }

  @Post('mahasiswa/:nim/upload')
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })

  // @UseInterceptors(FileInterceptor(file))
  // async uploadMahasiswaFoto(@UploadedFile() file: Express.Multer.File, @Param('nim') nim: string) {
  //   if (!file) throw new BadRequestException('File tidak boleh kosong');
  //   return this.appService.uploadMahasiswaFoto(file, nim);
  // }

  @Get('mahasiswa/:nim/foto')
  async getMahasiswaFoto(@Param('nim') nim: string, @Res() res: Response) {
    const filename = await this.appService.getMahasiwaFoto(nim);
    return res.sendFile(filename, { root: 'uploads' });
  }

  @Post('register')
  @ApiBody({
    type: RegisterUserDTO
  })
  register(@Body() data: RegisterUserDTO) {
    return this.appService.register(data);
  }

  @Get("/auth")
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  auth(@UserDecorator() user: User) {
    return user;
  }

  @Post('login')
  @ApiBody({
    type: loginuserDTO
  })
  login(@Body() data: loginuserDTO) {
    return this.appService.login(data);
  }

  @Post('mahasiswa')
  @ApiBody({ type: CreateMahasiswadto })
  createMahasiswa(@Body() data: CreateMahasiswadto) {
    return this.appService.addMahasiswa(data);
  }

  @Delete('mahasiswa/:nim')
  deleteMahasiswa(@Param('nim') nim: string) {
    return this.appService.deleteMahasiswa(nim);
  }

  @Put('mahasiswa/:nim')
  @ApiBody({ type: updatemahasiswaDTO })
  editMahasiswa(@Param('nim') nim: string, @Body() data: updatemahasiswaDTO) {
    return this.appService.updateMahasiswa(nim, data);
  }

  @Get('mahasiswa')
  getMahasiswa() {
    return this.appService.getMahasiswa();
  }

  @Get('mahasiswa/:nim')
  getMahasiswaByNim(@Param('nim') nim: string) {
    return this.appService.getMahasiswaByNIM(nim);
  }
}