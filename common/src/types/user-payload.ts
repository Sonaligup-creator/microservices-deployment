export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UserPayload {
  id: string;
  email: string;
  isAdmin?: boolean;
  name?: string;
  image?: string;
  gender?: string;
  age?: number;
  bio?: string;
  shippingAddress?: ShippingAddress;
}
