import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    OnModuleInit,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/sequelize';
  import { User } from './models';
  import { LoginDto, RegisterDto } from './dtos';
  import * as bcrypt from 'bcryptjs';
  import { JwtHelper } from 'src/helpers';
  import { UserRoles } from './enums';
  
  @Injectable()
  export class AuthService implements OnModuleInit {
    constructor(
      @InjectModel(User) private userModel: typeof User,
      private jwtService: JwtHelper,
    ) {}
  
    async onModuleInit() {
      await this.seedUser();
    }
  
    async register(payload: RegisterDto) {
      const existingUser = await this.userModel.findOne({
        where: { email: payload.email.toLowerCase() },
      });
  
      if (existingUser) {
        throw new ConflictException('User with this email already exists.');
      }
  
      const passwordHash = await bcrypt.hash(payload.password, 10);
  
      const newUser = await this.userModel.create({
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: passwordHash,
        role: UserRoles.USER,
      });
  
      const userData = newUser.get();
      delete userData.password;
  
      return {
        message: 'Successfully registered ✅',
        data: userData,
      };
    }
  
    async login(payload: LoginDto) {
        const foundedUser = await this.userModel.findOne({ where: { email: payload.email } });
    
        if (!foundedUser) {
            throw new NotFoundException('User with this email does not exist');
        }
    
        const hashedPassword = foundedUser.dataValues.password;
        
        if (!hashedPassword) {
            throw new BadRequestException('User password is missing');
        }
    
        const isMatch = await bcrypt.compare(payload.password, hashedPassword);
    
        if (!isMatch) {
            throw new BadRequestException('Invalid password');
        }
    
        const token = await this.jwtService.generateToken({ id: foundedUser.id, role: foundedUser.dataValues.role });
    
        return {
            message: "Successfully logged in",
            data: {
                token,
                user: foundedUser.dataValues,
            }
        };
    }
    
  
    async seedUser() {
      const defaultUsers = [
        {
          name: 'Tom',
          email: 'tom@gmail.com',
          password: 'tom123',
          role: UserRoles.ADMIN,
        },
      ];
  
      for (const user of defaultUsers) {
        const existing = await this.userModel.findOne({
          where: { email: user.email.toLowerCase() },
        });
  
        if (!existing) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          await this.userModel.create({
            name: user.name,
            email: user.email.toLowerCase(),
            password: hashedPassword,
            role: user.role,
          });
  
          console.log(`Admin user created: ${user.email} ✅`);
        }
      }
    }
  }
  
