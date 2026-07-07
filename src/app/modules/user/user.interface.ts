export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'PROVIDER';
  phone?: string;
  address?: string;
  avatarUrl?: string;
  shopName?: string;
}

export interface RegisterCustomerInput extends Omit<RegisterInput, 'role' | 'shopName'> {
  role: 'CUSTOMER';
}

export interface RegisterProviderInput extends Omit<RegisterInput, 'role' | 'shopName'> {
  role: 'PROVIDER';
  shopName: string;
}

export type TRegisterUserInput = RegisterCustomerInput | RegisterProviderInput;
