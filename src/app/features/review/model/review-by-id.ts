export interface ReviewByIdModel {
  id: number;
  comment: string;
  rating: number;
  user:{
    id: number;
    pseudo: number;
  }
}
