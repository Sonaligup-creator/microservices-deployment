import { type ProductDeletedEvent, Publisher, Subjects } from '@ecommerce/common';

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
  subject: Subjects.ProductDeleted = Subjects.ProductDeleted;
}

