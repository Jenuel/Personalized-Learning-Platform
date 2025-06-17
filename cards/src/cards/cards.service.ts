import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cards } from './cards.entity';

@Injectable()
export class CardsService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(Cards)
        private readonly cardsRepository: Repository<Cards>
    ) {}

    async getAllCards(): Promise<Cards[]> {
        return this.cardsRepository.find();
    }

    async getCardById(cardId: number): Promise<Cards> {
        const card =  await this.cardsRepository.findOneBy({ cardId });

        if (!card) {
            throw new Error(`Card id: ${cardId} does not exist`);
        }

        return card;
    }

    async createCard(cardData: Partial<Cards>) : Promise<Cards> {
        return await this.dataSource.transaction(async (manager) => {
            const newCard = this.cardsRepository.create(cardData);
            return this.cardsRepository.save(newCard);
        })
    }

    async updateCard(cardId: number, cardData: Partial<Cards>): Promise<Cards> {
        const card = await this.getCardById(cardId);
        const updatedCard = Object.assign(card, cardData);
        return this.cardsRepository.save(updatedCard);
    }

    async deleteCard(cardId: number): Promise<{message: string}> {
        const card = await this.getCardById(cardId);
        await this.cardsRepository.remove(card);
        return { message: `Card id: ${cardId} deleted successfully` };
    }

}
