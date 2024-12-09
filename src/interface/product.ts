export interface ProductType {
  description: string;
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  quantity: number;
  info?: Info;
}

export interface Info {
  description: string;
  color: string[];
  size: string[];
  policy: string;
}

export interface ProductInfo {
  color: string[];
  size: string;
  description: string;
}

export interface ProductFormValues {
  name: string;
  price: number;
  quantity: number;
  info: ProductInfo;
}

export interface CategoryType {
  description: any;
  id: string;
  name: string;
}
