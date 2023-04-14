import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { IPagination } from '../interfaces/ipagination';

export const ReqOffsetAndLimit = createParamDecorator(
  (_, ctx: ExecutionContext): IPagination => {
    const request = ctx.switchToHttp().getRequest();

    const validatedRequest = validateRequest(request);

    if (!validatedRequest)
      throw new BadRequestException(
        'The request cannot be processed due to invalid limit or offset values. The limit must be a valid number and cannot exceed 10, while the offset must be a valid number. Please make sure to send valid values to proceed.',
      );

    return validatedRequest;
  },
);

function validateRequest(request: any): IPagination {
  // eslint-disable-next-line prefer-const
  let limit = request.query.limit;
  // eslint-disable-next-line prefer-const
  let offset = request.query.offset;

  const regex = /^-?\d+$/;

  if (limit) {
    if (!regex.test(limit)) return null;

    if (limit > 10) return null;
  }

  if (offset) if (!regex.test(offset)) return null;

  if (!limit) limit = 5;

  if (!offset) offset = 0;

  return {
    limit: +limit,
    offset: +offset,
    baseUrl: request.originalUrl.split('?')[0],
  };
}
