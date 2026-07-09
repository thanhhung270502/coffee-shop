export enum EProductType {
  DRINK = "DRINK",
  PACKAGED = "PACKAGED",
}

export type CategoryObject = {
  id: string;
  name: string;
  slug: string;
  type: EProductType;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

export type ListCategoriesResponse = {
  categories: CategoryObject[];
};

export type CreateCategoryRequest = {
  name: string;
  type: EProductType;
  sortOrder?: number;
};

export type CreateCategoryResponse = {
  category: CategoryObject;
};

export type UpdateCategoryRequest = {
  name?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type UpdateCategoryResponse = {
  category: CategoryObject;
};

export type DeleteCategoryResponse = {
  ok: boolean;
};
