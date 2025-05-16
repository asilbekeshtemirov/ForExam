import { IsString, MinLength, IsEmail, MaxLength, IsPositive, IsEnum, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRoles } from "../enums"; 

export class RegisterDto {
    @ApiProperty({ required: true, example: 'Exam' })
    @IsString()
    name: string;
    
    @ApiProperty({ required: false, enum: UserRoles, example: UserRoles.USER })
    @IsOptional()
    @IsEnum(UserRoles)
    role?: UserRoles; 

    @ApiProperty({ required: true, example: 'exam@gmail.com' })
    @IsEmail()
    email: string;
    
    @ApiProperty({ required: true, example: 'exam123' })
    @IsString()
    @MinLength(4)
    @MaxLength(12)
    password: string;


}
