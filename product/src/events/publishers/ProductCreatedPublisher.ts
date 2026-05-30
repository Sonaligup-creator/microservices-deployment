import { type ProductCreatedEvent, Publisher, Subjects } from '@ecommerce/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}

