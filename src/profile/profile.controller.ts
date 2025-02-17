import { BadRequestException, Controller, Get, Param, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserDecorator } from 'src/user.decorator';
import { User } from '@prisma/client';
import { query, Response } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @UserDecorator() user: User) {
    if(file == null) throw new BadRequestException("File tidak boleh kosong!!")
    return this.profileService.UploadedFile(file, user.id)
  }

  @Get("search")
  async getName(
    @Query("search" ) search : string
  ) {
    return search
  }

  @Get("/:id")
   async getProfile(@Param("id") id : number, @Res() res : Response) {
    const fileName = await this.profileService.sendMyFotoProfile(id)
    res.sendFile('../../uploads/'+fileName)
   }


}

