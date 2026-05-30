import type { OrderStatus } from '../types/order-status';
import type { CartItem } from '../types/cart-item';
import { Subjects } from './subjects';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string | Date;
    version: number;
    cart: CartItem[];
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid?: boolean;
    isDelivered?: boolean;
  };
}
