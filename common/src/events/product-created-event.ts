import { Subjects } from './subjects';

export interface ProductCreatedEvent {
  subject: Subjects.ProductCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    image: string;
    colors?: string | string[];
    sizes?: string | string[];
    brand?: string;
    category: string;
    material?: string;
    description: string;
    numReviews: number;
    rating: number;
    countInStock: number;
    isReserved: boolean;
    version: number;
  };
}
