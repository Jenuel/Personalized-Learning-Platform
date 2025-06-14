import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // import this
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Cards } from './cards.entity'; // import your entity


@Module({
   imports: [TypeOrmModule.forFeature([Cards])], 
  controllers: [CardsController],
  providers: [CardsService]
})
export class CardsModule {}
