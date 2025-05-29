import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cards {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    question: string;

    @Column()
    answer: string;
}