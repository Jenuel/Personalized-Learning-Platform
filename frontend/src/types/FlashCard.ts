
export interface FlashCard {
  id: string;
  front: string;
  back: string;
  interval?: number;
  easeFactor?: number;
  nextReview?: string;
}
