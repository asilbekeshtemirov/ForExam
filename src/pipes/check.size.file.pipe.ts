import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
  } from "@nestjs/common";
  
  @Injectable()
  export class CheckFileSize implements PipeTransform {
    constructor(private readonly maxSize: number) {}
  
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
      if (!value) {
        throw new BadRequestException("File is required!");
      }
  
      if (value.size > this.maxSize) {
        throw new BadRequestException(
          `File size should be less than ${this.maxSize / 1024 / 1024} MB`
        );
      }
  
      return value;
    }
  }
  