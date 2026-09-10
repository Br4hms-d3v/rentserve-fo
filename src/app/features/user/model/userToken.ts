import { RoleEnum } from '../../auth/enum/role-enum';

export interface UserTokenModel {
  id: number;
  name: string;
  firstName: string;
  birthdate: Date;
  email: string;
  role: RoleEnum;
  isActive: boolean;
  token: string;
}
