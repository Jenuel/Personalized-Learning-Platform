import { Controller, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    getAllCards() {
        return this.cardsService.getAllCards();
    }
    
    @Get(":id")
    getCardById(id: number) {
        try {
            return this.cardsService.getCardById(id);
        } catch (error) {
            throw new NotFoundException(`Card with id ${id} not found`);
        }
        
    }

}
