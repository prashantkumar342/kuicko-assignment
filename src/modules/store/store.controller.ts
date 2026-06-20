import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreDto } from './dto/store.dto';
import { StoreItemDto } from './dto/store-item.dto';
import { AbstractResponse } from '../../common/dto/abstract-response.dto';

@Controller('stores')
export class StoreController {
    constructor(private readonly storeService: StoreService) { }

    // get a list of all stores in the system
    @Get()
    async findAll(): Promise<AbstractResponse<StoreDto[]>> {
        const data = await this.storeService.findAll();
        return AbstractResponse.success(data, 'Stores retrieved successfully');
    }

    // get details for a specific store by its id
    @Get(':id')
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<AbstractResponse<StoreDto>> {
        const data = await this.storeService.findOne(id);
        return AbstractResponse.success(data, 'Store retrieved successfully');
    }

    // fetch all items available at a given store
    @Get(':id/items')
    async findStoreItems(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<AbstractResponse<StoreItemDto[]>> {
        const data = await this.storeService.findStoreItems(id);
        return AbstractResponse.success(data, 'Store items retrieved successfully');
    }
}