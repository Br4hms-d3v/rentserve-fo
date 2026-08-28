export interface CategoryModel {
  position: number;
  id: number;
  nameCategory: string;
}

export interface CategoryResponse {
  _embedded: {
    categoryDTOList: CategoryModel[];
  };
}
