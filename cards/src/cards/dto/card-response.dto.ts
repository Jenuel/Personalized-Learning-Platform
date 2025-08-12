import { Expose } from 'class-transformer';

export class CardResponseDto {
  @Expose()
  cardId: number;

  @Expose()
  question: string;

  @Expose()
  answer: string;
}
