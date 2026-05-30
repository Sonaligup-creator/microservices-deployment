import { Publisher, type OrderUpdatedEvent, Subjects } from '@ecommerce/common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEvent> {
  subject: Subjects.OrderUpdated = Subjects.OrderUpdated;
}

