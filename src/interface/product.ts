export interface ProductType {
  urls: string[];
  url: string;
  id: string;
  name: string;
  category: { id: string; name: string };
  categoryId?: string;
  price: number;
  quantity: number;
  info?: Info;
  photos?: string[];
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
