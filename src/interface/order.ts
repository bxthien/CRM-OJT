export interface Order {
  orderId: string;
  methodShipping: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  address: Address;
  coupon?: Coupon;
  transactions: Transaction;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  fullName: string;
  address: string;
  phone: string;
  url?: string;
  description?: string;
  avatar?: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  addressId: string;
  phone: string;
  email: string;
  recipientName: string;
  province: string;
  district: string;
  ward: string;
  detailedAddress: string;
}

export interface Coupon {
  couponId: string;
  code: string;
  discountPercent: number;
  expirationDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  reduce: any;
  map: any;
  length: number;
  transactionId: string;
  isDelete: false;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    price: number;
    isDelete: false;
    url?: string;
    info: {
      description: string;
      color: string;
      size: string;
      policy: string;
    };
    quantity: number;
  };
}