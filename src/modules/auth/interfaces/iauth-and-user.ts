import { Auth } from 'src/repositories/implementations/mongodb/schemas/auth.schema';
import { User } from 'src/repositories/implementations/mongodb/schemas/user.schema';

export class IAuthAndUser {
  auth: Auth;
  user: User;
}
