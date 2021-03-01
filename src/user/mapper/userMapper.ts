import { UserEntity } from '../user.entity';
import { GetUserResponseDto } from '../dto/getUserResponseDto';

export const UserMapper = {
  fromEntity(userEntity: UserEntity): GetUserResponseDto {
    const user = new GetUserResponseDto();
    user.id = userEntity.id;
    user.firstName = userEntity.firstName;
    user.lastName = userEntity.lastName;
    user.email = userEntity.email;
    user.confirmed = userEntity.confirmed;

    return user;
  },
};
