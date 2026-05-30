import { Subjects } from './subjects';

export interface ProductUpdatedEvent {
  subject: Subjects.ProductUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    image: string;
    colors: string[];
    sizes: string[];
    brand: string;
    category: string;
    material: string;
    description: string;
    numReviews: number;
    rating: number;
    countInStock: number;
    isReserved: boolean;
    version: number;
  };
}
