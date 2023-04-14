import { Injectable } from '@nestjs/common';
import { IPagination } from './interfaces/ipagination';

@Injectable()
export class PaginationService {
  handlePagination({ baseUrl, limit, offset }: IPagination, total: number) {
    const next = offset + limit;
    const nextUrl =
      next < total ? `${baseUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previuousUrl =
      previous != null ? `${baseUrl}?limit=${limit}&offset=${previous}` : null;

    return { nextUrl, previuousUrl };
  }
}
