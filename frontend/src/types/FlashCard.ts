
export interface FlashCard {
  id: string;
  front: string;
  back: string;
  createdAt: Date;
  lastReviewed?: Date;
  interval?: number;
  easeFactor?: number;
  nextReview?: string;
}
