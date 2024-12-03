export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  address: string;
  phoneNumber: number;
  url: string;
  description: string;
  avatar: string;
  isActive: boolean
}

export interface UserProfile {
  username: string;
  email: string;
}

export interface SignInResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  phone?: string;
  username?: string;
}

export interface ForgotPayload {
  email: string;
}
