import { IUser } from 'src/modules/user/interfaces/iuser';
import { User } from 'src/repositories/implementations/mongodb/schemas/user';

export function toIUser(user: User): IUser {
  return {
    account_id: user.account_id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    bio: user.bio,
    user_type: user.user_type,
    email: {
      address: user.email.address,
      verified_at: user.email.verified_at,
      _id: user.email._id,
    },
    avatar_url: user.avatar_url,
    profile_url: user.profile_url,
    createdAt: user.createdAt,
  };
}
