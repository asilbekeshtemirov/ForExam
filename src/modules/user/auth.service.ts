import { BadRequestException, ConflictException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UserRoles } from "./enums";
import { LoginDto, RegisterDto } from "./dtos";
import { error } from "console";

@Injectable()
export class AuthService  {
    constructor(
        @InjectModel(User) private userModel: typeof User,
        private jwtService: JwtService
    ) {}
    async register(payload: RegisterDto) {
        const foundedUser = await this.userModel.findOne({ where: { email: payload.email } });

        if(foundedUser) {
            throw new ConflictException("Bu emaillik foydalanuvchi alaqachon ro'yxatdan o'tgan")
        }
        
        
    };

    async login(payload: LoginDto) {}

}