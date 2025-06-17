import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Cards } from './cards.entity';
import { OneToOne, JoinColumn } from 'typeorm';

@Entity()
export class CardMetadata {
  @PrimaryColumn()
  cardId: number; // this is the PK and FK column

  @OneToOne(() => Cards, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'cardId' }) // link the relation to this column
  card: Cards;

  @Column({ default: 'new' })
  status: string;
}
