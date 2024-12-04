export interface ProductType {
  url: string;
  id: string;
  name: string;
  category: CategoryType;
  price: number;
  quantity: number;
  info?: Info;
}

export interface Info {
  url: string;
  description: string;
  color: string[];
  size: string[];
  policy: string;
}

export interface ProductInfo {
  color: string[];
  size: string;
  description: string;
  url: string;
}

export interface ProductFormValues {
  name: string;
  price: number;
  quantity: number;
  info: ProductInfo
  url: string;
}

export interface CategoryType {
  id: string;
  name: string;
}
