export interface ProductType {
  urls: string[];
  id: string;
  name: string;
  price: number;
  url: string | null;
  info: {
    description: string;
    policy: string;
  };
  quantity: number;
  createdAt: string;
  updatedAt: string;
  photos: Photo[];
  categoryId: string;
}

export type Photo = {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};


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
