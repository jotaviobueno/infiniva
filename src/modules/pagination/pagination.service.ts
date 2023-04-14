import { Injectable } from '@nestjs/common';
import { IOffsetAndLimit } from './interfaces/ioffset-and-limit';

@Injectable()
export class PaginationService {
  handlePagination({ baseUrl, limit, offset }: IOffsetAndLimit, total: number) {
    const next = offset + limit;
    const nextUrl =
      next < total ? `${baseUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previuousUrl =
      previous != null ? `${baseUrl}?limit=${limit}&offset=${previous}` : null;

    return { nextUrl, previuousUrl };
  }
}
