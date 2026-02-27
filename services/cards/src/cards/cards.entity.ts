import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { CardMetadata } from './cardmetadata.entity';

@Entity('flashcards')
export class Cards {
  @PrimaryGeneratedColumn()
  cardId: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @OneToOne(() => CardMetadata, (meta) => meta.card, { cascade: true })
  metadata: CardMetadata;
}
