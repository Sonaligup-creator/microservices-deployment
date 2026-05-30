import { type ProductUpdatedEvent, Publisher, Subjects } from '@ecommerce/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}

