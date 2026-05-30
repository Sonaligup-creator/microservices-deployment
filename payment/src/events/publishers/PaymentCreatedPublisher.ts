import { Subjects, Publisher, type PaymentCreatedEvent } from '@ecommerce/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

