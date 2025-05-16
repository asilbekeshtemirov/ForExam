import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { FsHelper } from "src/helpers";
import { ProductService } from "./product.service";
import { Products } from "./models";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
    imports:[SequelizeModule.forFeature([Products])],
    controllers:[ProductController],
    providers:[FsHelper,ProductService]
})

export class ProductModule {}