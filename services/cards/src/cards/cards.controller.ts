import { Controller, Body, Param, Get, Post, Put, Delete, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { CardResponseDto } from './dto/card-response.dto';

@Controller('cards')
export class CardsController {
    constructor(private readonly cardsService: CardsService) {}

    @Get()
    async getAllCards(): Promise<CardResponseDto[]> {
        const cards = await this.cardsService.getAllCards();
        return plainToInstance(CardResponseDto, cards, {
            excludeExtraneousValues: true,
        });
    }

    @Get(':id')
    async getCardById(@Param('id') id: number): Promise<CardResponseDto> {
        try {
            const card = await this.cardsService.getCardById(id);
            return plainToInstance(CardResponseDto, card, {
                excludeExtraneousValues: true,
            });
        } catch (error) {
            throw new NotFoundException(`Card with id ${id} not found`);
        }
    }

    @Post()
    async createCard(@Body() cardData: CreateCardDto): Promise<CardResponseDto> {
        const card = await this.cardsService.createCard(cardData);
        return plainToInstance(CardResponseDto, card, {
            excludeExtraneousValues: true,
        });
    }

    @Put(':id')
    async updateCard(@Param('id') id: number, @Body() cardData: CreateCardDto): Promise<CardResponseDto> {
        try {
            const updated = await this.cardsService.updateCard(id, cardData);
            return plainToInstance(CardResponseDto, updated, {
                excludeExtraneousValues: true,
            });
        } catch (error) {
            throw new NotFoundException(`Card with id ${id} not found`);
        }
    }

    @Delete(':id')
    async deleteCard(@Param('id') id: number) {
        try {
            return await this.cardsService.deleteCard(id);
        } catch (error) {
            throw new NotFoundException(`Card with id ${id} not found`);
        }
    }
}
