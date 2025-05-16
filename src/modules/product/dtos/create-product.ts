import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsPositive, IsString } from "class-validator";
import { ENUM } from "sequelize";
import { status } from "../enum/status.enum";

export class CreateProductDto {
    @ApiProperty({ required: true, example: 'Ferrari F90' })
    @IsString()
    name: string;

    @ApiProperty({ required: true, example: "Ferrari sport car" })
    description: string;

    @ApiProperty({ required: true, example: 1200 })
    @Type(() => Number)
    @IsPositive()
    price: number;

    @ApiProperty({ required: true, example: 30 })
    @Type(() => Number)
    @IsPositive()
    discount: number;

    @ApiProperty({ required: true, example: 1 })
    @Type(() => Number)
    @IsPositive()
    rating: number;

    @ApiProperty({ required: true, example: 30 })
    @Type(() => Number)
    @IsPositive()
    stock: number;


    @ApiProperty({})
    @Type(() => ENUM)
    status: status;

    @ApiProperty({ required: true, example: "ferrari.jpg" })
    image_url: string;


}