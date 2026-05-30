import type { OrderStatus } from '../types/order-status';
import type { CartItem } from '../types/cart-item';
import { Subjects } from './subjects';

export interface OrderUpdatedEvent {
  subject: Subjects.OrderUpdated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string | Date;
    version: number;
    cart?: CartItem[];
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    isPaid?: boolean;
    paidAt?: Date | string;
    isDelivered?: boolean;
    deliveredAt?: Date | string;
  };
}
