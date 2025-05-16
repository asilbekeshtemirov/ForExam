import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./models"
import { JwtService } from "@nestjs/jwt"
import { RegisterDto } from "./dtos";
import * as bcrypt from "bcryptjs"
import { LoginDto } from "./dtos";
import { JwtHelper } from "src/helpers";
import { UserRoles } from "./enums";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly JwtService: JwtService,
        private readonly JwtHelper: JwtHelper
    ) {}

    async login(payload: LoginDto) {
        const foundedUser = await this.userModel.findOne({
            where: { email: payload.email }
        });

        if (!foundedUser) {
            throw new ConflictException('User with this email does not exist!');
        }

        const isMatch = await bcrypt.compare(payload.password, foundedUser.dataValues.password);

        if (!isMatch) {
            throw new BadRequestException("Invalid password!");
        }

        const { token } = await this.JwtHelper.generateToken({ id: foundedUser.id, role: foundedUser.dataValues.role });
        return {
            message: "Successfully logged!",
            token,
            data: foundedUser.dataValues
        };
    }

    async register(payload: RegisterDto) {
        const foundedUser = await this.userModel.findOne({
            where: { email: payload.email }
        });

        if (foundedUser) {
            throw new ConflictException('User with this email already exists!');
        }

        const passHash = bcrypt.hashSync(payload.password);

        const user = await this.userModel.create({
            email: payload.email,
            role: UserRoles.USER,
            name: payload.name,
            password: passHash,
        });

        return {
            message: "Successfully registered!",
            data: user.dataValues
        };
    }

    async setAdmin() {
        const adminEmail = 'tom@gmail.com';

        const existingAdmin = await this.userModel.findOne({ where: { email: adminEmail } });
        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('tom123', 10);

        await this.userModel.create({
            name: 'Tom',
            email: adminEmail,
            password: hashedPassword,
            role: UserRoles.ADMIN,
        });

        console.log('Admin user created');
    }
}
