import { Publisher, type OrderCreatedEvent, Subjects } from '@ecommerce/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

