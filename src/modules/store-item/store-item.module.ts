import { Module } from '@nestjs/common';
import { StoreItemService } from './store-item.service';

@Module({
  providers: [StoreItemService]
})
export class StoreItemModule {}
