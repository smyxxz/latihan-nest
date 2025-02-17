import {  BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException, Param } from '@nestjs/common';
import { CreateMahasiswadto } from './dto/create-mahasiswa.dto';
import prisma from './prisma';
import { RegisterUserDTO } from './dto/register-user.dto';
import { hash } from 'crypto';
import { compareSync, hashSync } from 'bcrypt';
import { loginuserDTO } from './dto/login-user.dto';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { extname, join } from 'path';

@Injectable()

export class AppService {

  constructor(private readonly jwtService: JwtService) {}
  async cariMahasiswa(filters: { nama?: string }) {
    const where: any = {};

    if (filters.nama) {
      where.nama = { contains: filters.nama };
    }
    return await prisma.mahasiswa.findMany({ where });
  }

  async uploadMahasiswaFoto(file: Express.Multer.File, nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Mahasiswa Tidak Ditemukan');

    if (mahasiswa.foto_profile) {
      const filePath = `/src/uploads${mahasiswa.foto_profile}`;
      if (existsSync(filePath)) {
        rmSync(filePath);
      }
    }
    const uploadPath = join(__dirname, '../uploads/');
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath);
    }

    const fileExt = extname(file.originalname);
    const baseFilename = mahasiswa.nim;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${baseFilename}-${uniqueSuffix}${fileExt}`;
    const filePath = `${uploadPath}${filename}`;

    writeFileSync(filePath, file.buffer);
    await prisma.mahasiswa.update({
      where: { nim },
      data: { foto_profile: filename },
    });

    return filename;
  }

async register(data: RegisterUserDTO) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: data.username,
        },
      });

      if(user != null) {
        throw new BadRequestException("Username sudah digunakan");
      }
      console.log(data)

      const hash = hashSync(data.password, 10);

      const newUser = await prisma.user.create({
        data: {
          username: data.username,
          password: hash,
          role : "USER"
        },
      });
      return newUser;

  }catch (error) {
    console.log(error)
    if(error instanceof HttpException) throw error
    throw new  InternalServerErrorException("ada masaalah pada server");
  }
}



async auth(user_id : number) {
   try {
  const user = await prisma.user.findFirst({
  where : {
    id : user_id
  }
  })
  if(user == null) throw new NotFoundException("User Tidak Ditemukan")
  return user
  }catch(err) {
  if(err instanceof HttpException) throw err
  throw new InternalServerErrorException("Terdapat Masalah Dari Server Harap Coba Lagi dalam beberapa menit")
  }
  }

  async getMahasiwaFoto(nim: string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({ where: { nim } });
    if (!mahasiswa) throw new NotFoundException('Mahasiswa Tidak Ditemukan');
    return mahasiswa.foto_profile;
  }

async login(data: loginuserDTO) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: data.username,
      },
    });
    if (user === null) {
      throw new NotFoundException("userName yang anda masukkan salah");
    }

    // const isPasswordValid = hashSync(data.password, user.password);
    if (compareSync(data.password, user.password) === false) {
      throw new BadRequestException("Password salah");
    }
    const payload = {
      id : user.id,
      username: user.username,
      role: user.role,
    }

    const token = await this.jwtService.signAsync(payload);
    return {
      token : token,
      user,
    };



  } catch (error) {
    if (error instanceof HttpException) throw error;
    throw new InternalServerErrorException("Ada masalah pada server");
  }
}

  async getMahasiswa() {
    return await prisma.mahasiswa.findMany();
  }

  async getMahasiswaByNIM(nim : string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim
      }
    })

    if(mahasiswa == null)
      throw new NotFoundException("Tidak Menemukan NIM")

    return mahasiswa

  }

  async addMahasiswa(data : CreateMahasiswadto) {
    await prisma.mahasiswa.create({
      data
    })

    return await prisma.mahasiswa.findMany()
  }

  async deleteMahasiswa(nim : string) {
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where : {
        nim
      }
    })

    if(mahasiswa == null) {
      throw new NotFoundException("Tidak Menemukan NIM")
    }

    await prisma.mahasiswa.delete({
      where : {
        nim
      }
    })

    return await prisma.mahasiswa.findMany()
  }

  async updateMahasiswa(nim: string, data: CreateMahasiswadto) {
    // Cari mahasiswa berdasarkan NIM
    const mahasiswa = await prisma.mahasiswa.findFirst({
      where: { nim },
    });


    // Jika tidak ditemukan, lemparkan error
    if (mahasiswa === null) {
      throw new NotFoundException("Mahasiswa dengan NIM tersebut tidak ditemukan.");
    }
  await prisma.mahasiswa.update({
    // Perbarui data mahasiswa
      where: { nim

      },
      data:data
    });

    // Kembalikan data mahasiswa yang diperbarui
    return await prisma.mahasiswa.findMany();
  }
}