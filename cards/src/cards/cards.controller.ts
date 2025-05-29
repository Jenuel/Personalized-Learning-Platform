import { Controller, Body, Param, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    getAllCards() {
        return this.cardsService.getAllCards();
    }
    
    @Get(":id")
    getCardById(@Param("id") id: number) {
        try {
            return this.cardsService.getCardById(id);
        } catch (error) {
            throw new NotFoundException(`Card with id ${id} not found`);
        }
        
    }

    @Post()
    createCard(@Body() cardData: CreateCardDto) {
        return this.cardsService.createCard(cardData);
    }

    @Put(":id")
    updateCard(@Param("id") id: number, @Body() cardData: CreateCardDto) {
        try {
            return this.cardsService.updateCard(id, cardData);
        } catch (error) {
            throw new NotFoundException(`Card with id ${id} not found`);
        }
    }

    @Delete(":id")
    deleteCard(@Param("id") id: number) {
        try {
            return this.cardsService.deleteCard(id);
        } catch (error) {
            throw new NotFoundException(`Card with id ${id} not found`);
        }
    }

}
