import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./models";
import { JwtHelper } from "src/helpers";
import { FsHelper } from "src/helpers/fs.helper"; 
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        SequelizeModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: process.env.ACCESS_TOKEN_SECRET,
            signOptions: {
                expiresIn: process.env.ACCESS_TOKEN_TIME ? parseInt(process.env.ACCESS_TOKEN_TIME) : '1h'
            },
        })
    ],
    providers: [ AuthService, JwtHelper, FsHelper], 
    controllers: [ AuthController],
})
export class UserModule {}
