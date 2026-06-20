import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { StoreModule } from './modules/store/store.module';
import { ItemModule } from './modules/item/item.module';
import { OrderModule } from './modules/order/order.module';
import { StoreItemModule } from './modules/store-item/store-item.module';
import { OrderItemModule } from './modules/order-item/order-item.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), PrismaModule, StoreModule, ItemModule, OrderModule, StoreItemModule, OrderItemModule],
})
export class AppModule { }
