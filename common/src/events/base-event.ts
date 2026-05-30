import type { Subjects } from './subjects';

export interface Event {
  subject: Subjects;
  data: any;
}
