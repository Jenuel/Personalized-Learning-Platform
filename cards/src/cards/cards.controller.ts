import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    getAllCards() {
        return this.cardsService.getAllCards();
    }
    

}
