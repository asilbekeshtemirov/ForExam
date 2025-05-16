import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsOptional, IsPositive, IsString } from "class-validator";

export class ProductQueryDto {
  @ApiProperty({ required: false, example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  limit?: number;

  @ApiProperty({ required: false, example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  page?: number;

  @ApiProperty({ required: false, example: 'ASC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @ApiProperty({ required: false, example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string; 
}
