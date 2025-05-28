import { Injectable } from '@nestjs/common';

@Injectable()
export class CardsService {
    getAllCards() {
        return "List of all cards";
    }
}
