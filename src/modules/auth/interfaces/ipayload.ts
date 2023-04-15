export class IPayload {
  sub: {
    id: string;
    access_id: string;
  };
  iat: number;
  exp: number;
}
