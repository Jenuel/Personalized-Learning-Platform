import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Cards } from './cards.entity';

@Entity()
export class CardMetadata {
  @PrimaryColumn()
  cardId: number;

  @OneToOne(() => Cards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cardId' })
  card: Cards;

  @Column({ type: 'int', default: 0 })
  interval: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  next_review: string; 

  @Column({ type: 'float', default: 2.5 })
  ease_factor: number;
}
