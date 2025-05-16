import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./dtos";
import { Protected, Roles } from "src/decorators";
import { UserRoles } from "./enums";

@Controller("auth")
export class AuthController {
    constructor(private service: AuthService) { }

    @Post("register")
    @Protected(false)
    @Roles([UserRoles.ADMIN,UserRoles.USER])
    async register(@Body() body: RegisterDto) {
        return await this.service.register(body)
    }
    @Post("login")
    @Protected(false)
    @Roles([UserRoles.ADMIN,UserRoles.USER])
    async login(@Body() body: LoginDto) {
        console.log(body)
        return await this.service.login(body)
    }
}
