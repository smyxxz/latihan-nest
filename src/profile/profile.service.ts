import { Injectable, NotFoundException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { extname } from 'path';
import prisma from 'src/prisma';

@Injectable()
export class ProfileService {
    async UploadedFile(file: Express.Multer.File, user_id : number)
    {
    const user = await
    prisma.user.findFirst({where : {
        id : user_id
    }
    })
    if(user == null) throw new NotFoundException("Tidak Menemukan User")
    if(user.foto_profile != null){
        const filePath = `../../uploads/${user.foto_profile}`;
        if(existsSync(filePath)){
            rmSync(filePath)
        }
    }
    const uploadPath = '../../uploads';
    if(!existsSync(uploadPath)){
        mkdirSync(uploadPath)
    }
    const fileExt = extname(file.originalname);
    const baseFileName = user.username;
    const uniqeSuffix = Date.now()+ '-' + Math.round(Math.random() * 1E9);`${baseFileName}-${uniqeSuffix}${fileExt}`;
    const fileName = `${baseFileName}-${uniqeSuffix}${fileExt}`;
    const filePath = `${uploadPath}/${fileName}`;
    writeFileSync(filePath, file.buffer);
    await prisma.user.update({
        where : {
            id : user_id
        },
        data : {
            foto_profile : fileName
        }
    })
    return {fileName, path: filePath};
    }
    async sendMyFotoProfile(user_id : number){
        const user = await prisma.user.findFirst({
            where : {
                id : user_id
            }
        })
        if(user == null) throw new NotFoundException("Tidak Menemukan User")
        return user.foto_profile
    }
}

