import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Products } from './models';
import { CreateProductDto } from './dtos/create-product';
import { FsHelper } from 'src/helpers';
import { ProductQueryDto } from './dtos/product.query.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Products) private readonly productModel: typeof Products,
    private readonly fs: FsHelper,
  ) { }

  async getAll(query: ProductQueryDto) {
    const limit = query.limit || 10;
    const page = query.page || 1;
    const offset = (page - 1) * limit;
    const sortBy = query.sortBy || 'price';
    const sortOrder = query.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const products = await this.productModel.findAll({
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    return {
      message: 'Success!',
      data: products,
    };
  }

  async createProduct(payload: CreateProductDto, image?: Express.Multer.File) {
    const existing = await this.productModel.findOne({ where: { name: payload.name } });
    if (existing) {
      throw new BadRequestException('This product already exists!');
    }

    let imageUrl = '';
    if (image) {
      imageUrl = await this.fs.uploadFile(image);
    }

    const newProduct = await this.productModel.create({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      discount: payload.discount,
      rating: payload.rating,
      stock: payload.stock,
      status: payload.status,
      image_url: imageUrl,
    });

    return {
      message: 'Successfully created!',
      data: newProduct,
    };
  }

  async updateProduct(payload: CreateProductDto, id: number) {
    const existing = await this.productModel.findByPk(id);
    if (!existing) {
      throw new BadRequestException('This product does not exist!');
    }

    const updated = await this.productModel.update(
      {
        name: payload.name ?? existing.name,
        description: payload.description ?? existing.description,
        price: payload.price ?? existing.price,
        discount: payload.discount ?? existing.discount,
        rating: payload.rating ?? existing.rating,
        stock: payload.stock ?? existing.stock,
        status: payload.status ?? existing.status,
        image_url: payload.image_url ?? existing.image_url,
      },
      { where: { id } },
    );

    return {
      message: 'Successfully updated!',
      data: updated,
    };
  }

  async updateImage(id: number, image: Express.Multer.File) {
    const existing = await this.productModel.findByPk(id);
    if (!existing) {
      throw new BadRequestException('This product does not exist!');
    }

    if (existing.image_url) {
      await this.fs.deleteFile(existing.image_url);
    }

    let imageUrl = '';
    if (image) {
      imageUrl = await this.fs.uploadFile(image);
    }

    const updated = await this.productModel.update(
      { image_url: imageUrl },
      { where: { id } },
    );

    return {
      message: 'Image successfully updated!',
      data: updated,
    };
  }

  async deleteProduct(id: number) {
    const existing = await this.productModel.findByPk(id);
    if (!existing) {
      throw new BadRequestException('This product does not exist!');
    }

    if (existing.image_url) {
      await this.fs.deleteFile(existing.image_url);
    }

    const deleted = await this.productModel.destroy({ where: { id } });

    return {
      message: 'Product successfully deleted!',
      data: deleted,
    };
  }

  async seedProducts() {
    const filePath = path.join(process.cwd(), 'src/modules/product/data/products.json');
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const products = JSON.parse(fileData);
    let addedCount = 0;
    for (const product of products.slice(0, 20)) {
      const exists = await this.productModel.findOne({ where: { name: product.name } });
      if (!exists) {
        await this.productModel.create(product);
        addedCount++;
      }
    }

    console.log(`${addedCount} product(s) added`);
  }
}
