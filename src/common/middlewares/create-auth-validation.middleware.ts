import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { CreateAuthDto } from 'src/modules/auth/dto/create-auth.dto';

@Injectable()
export class CreateAuthValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    const createAuthDto = new CreateAuthDto();

    createAuthDto.email = body.email;
    createAuthDto.password = body.password;

    const validations = await validate(createAuthDto);

    if (validations.length) {
      throw new BadRequestException(
        validations.reduce((acc, curr) => {
          return [...acc, ...Object.values(curr.constraints)];
        }, []),
      );
    }

    if (body.email && body.password) {
      if (Object.keys(body).length >= 3) {
        throw new BadRequestException([
          'just the properties email and password should exist',
        ]);
      }
    }

    next();
  }
}
