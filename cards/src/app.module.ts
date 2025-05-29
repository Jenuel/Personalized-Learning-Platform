import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "cards_db",
    autoLoadEntities: true,
    synchronize: true,
  }), CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
