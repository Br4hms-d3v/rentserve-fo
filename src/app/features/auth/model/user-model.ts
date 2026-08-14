import {RoleEnum} from '../enum/role-enum';

export interface UserModel {
  id: number;
  name: string;
  firstName: string;
  birthdate: Date;
  email: string;
  role: RoleEnum;
  isActive: boolean;
  token: string;
}
