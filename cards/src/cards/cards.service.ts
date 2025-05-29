import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cards } from './cards.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Cards)
        private readonly cardsRepository: Repository<Cards>
    ) {}

    async getAllCards(): Promise<Cards[]> {
        return this.cardsRepository.find();
    }

    async getCardById(id: number): Promise<Cards> {
        const card =  await this.cardsRepository.findOneBy({ id });

        if (!card) {
            throw new Error(`Card id: ${id} does not exist`);
        }

        return card;
    }

    async createCard(cardData: Partial<Cards>) : Promise<Cards> {
        const newCard = this.cardsRepository.create(cardData);
        return this.cardsRepository.save(newCard);
    }

    async updateCard(id: number, cardData: Partial<Cards>): Promise<Cards> {
        const card = await this.getCardById(id);
        const updatedCard = Object.assign(card, cardData);
        return this.cardsRepository.save(updatedCard);
    }

    async deleteCard(id: number): Promise<{message: string}> {
        const card = await this.getCardById(id);
        await this.cardsRepository.remove(card);
        return { message: `Card id: ${id} deleted successfully` };
    }

}
