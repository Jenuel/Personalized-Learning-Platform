import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OneToOne } from 'typeorm';
import { CardMetadata } from './cardmetadata.entity';
import { BeforeInsert } from 'typeorm';

@Entity('flashcards')
export class Cards {
    @PrimaryGeneratedColumn()
    cardId: number;

    @Column()
    question: string;

    @Column()
    answer: string;

    @OneToOne(()=> CardMetadata, (meta) => meta.card, { cascade: true })
    metadata: CardMetadata;

}