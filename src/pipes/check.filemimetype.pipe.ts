import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
  } from "@nestjs/common";
  
  @Injectable()
  export class CheckMimetype implements PipeTransform {
    constructor(private readonly mimetypes: string[]) {}
  
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
      if (!value) {
        throw new BadRequestException('File is required!');
      }
  
      if (!this.mimetypes.includes(value.mimetype)) {
        throw new BadRequestException(
          `Only ${this.mimetypes.join(', ')} files are allowed!`
        );
      }
  
      return value;
    }
  }
  