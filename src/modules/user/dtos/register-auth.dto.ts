import { IsString, MinLength, IsEmail, MaxLength, IsPositive, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "../enums"; 

export class RegisterDto {
    @ApiProperty({ required: true, example: 'tom' })
    @IsString()
    name: string;
    
    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles; 

    @ApiProperty({ required: true, example: 'tom@gmail.com' })
    @IsEmail()
    email: string;
    
    @ApiProperty({ required: true, example: 'tom123' })
    @IsString()
    @MinLength(4)
    @MaxLength(12)
    password: string;


}
