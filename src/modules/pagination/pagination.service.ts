import { Injectable } from '@nestjs/common';
import { IOffsetAndLimit } from './interfaces/ioffset-and-limit';

@Injectable()
export class PaginationService {
  private pagination(
    { baseUrl, limit, offset }: IOffsetAndLimit,
    total: number,
  ) {
    const next = offset + limit;
    const nextUrl =
      next < total ? `${baseUrl}?limit=${limit}&offset=${next}` : null;

    const previous = offset - limit < 0 ? null : offset - limit;
    const previuousUrl =
      previous != null ? `${baseUrl}?limit=${limit}&offset=${previous}` : null;

    return { nextUrl, previuousUrl };
  }

  handlePagination(data: any[], offsetAndLimit: IOffsetAndLimit) {
    const { nextUrl, previuousUrl } = this.pagination(
      offsetAndLimit,
      data.length,
    );

    return {
      nextUrl,
      previuousUrl,
      limit: offsetAndLimit.limit,
      offset: offsetAndLimit.offset,
      total: data.length,
      data_len: data.length,
      data: data,
    };
  }
}
