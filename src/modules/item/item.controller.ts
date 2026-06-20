import { Controller, Get } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from './dto/item.dto';
import { AbstractResponse } from '../../common/dto/abstract-response.dto';

@Controller('items')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    // get the global catalog of all items
    @Get()
    async findAll(): Promise<AbstractResponse<ItemDto[]>> {
        const data = await this.itemService.findAll();
        return AbstractResponse.success(data, 'Items retrieved successfully');
    }
}
