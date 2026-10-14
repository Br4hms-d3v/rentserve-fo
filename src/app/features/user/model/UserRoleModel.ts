import { Role } from '../enum/role';

export interface UserRoleModel {
  id: number;
  name: string;
  firstName: string;
  pseudo: String;
  role: Role;
  createdAt: Date;
}

export interface UserRoleResponse{
  _embedded: {
    userRoleDTOList: UserRoleModel[];
  }
}
