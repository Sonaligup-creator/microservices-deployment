import {
  Subjects,
  Publisher,
  type ExpirationCompletedEvent
} from '@ecommerce/common';

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}

