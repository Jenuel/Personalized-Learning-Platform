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
}
