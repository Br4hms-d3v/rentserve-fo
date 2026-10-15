import { UserFavorModel } from '../../userFavor/model/userFavor';
import { UserMaterialModel } from '../../userMaterial/model/userMaterial';

export interface RentalNotPaidModel {
  id: number;
  amount: number;
  dateStart: string;
  dateEnd: string;
  startTime: string;
  endTime: string;
  UserFavor: UserFavorModel;
  userMaterial: UserMaterialModel;
  durationDays: string;
  durationHours: string;
  billId: number;
}

export interface RentalNotPaidResponse {
  _embedded: {
    rentalByIdDTOList: RentalNotPaidModel[];
  };
}
