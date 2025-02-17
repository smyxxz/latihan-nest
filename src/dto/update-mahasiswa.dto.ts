import { ApiProperty } from "@nestjs/swagger";
import { Jenis_kelamin} from "@prisma/client";
import { IsString, IsNotEmpty, Length, IsEnum, IsOptional } from "class-validator";


export class updatemahasiswaDTO {

    @ApiProperty({description : "Foto Profile",
        type : String,
        example : "http://localhost:3000/uploads/105841105422.jpg"})
    @IsString()
    @IsOptional()
    foto_profile? : string;

    @ApiProperty({description : "Nim",
        type : String,
        example : "105841105422"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 12)
    nim : string;

    @ApiProperty({description : "Nama",
        type : String,
        example : "SYAUQIYAH MUJAHIDAH YAHYA"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    nama : string;

    @ApiProperty({description : "kelas",
        type : String,
        example : "5B"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    kelas : string;

    @ApiProperty({description : "jurusan",
        type : String,
        example : "INFORMATIKA"
    })
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    jurusan : string;

    @ApiProperty({
        description : "Jenis Kelamin",
        enum : Jenis_kelamin,
        example : "P"
    })
    @IsEnum(Jenis_kelamin)
    jenis_kelamin : Jenis_kelamin;

}
