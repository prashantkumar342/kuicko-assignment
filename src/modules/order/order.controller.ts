import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderCreatedResponseDto, OrderResponseDto } from './dto/order-response.dto';
import { AbstractResponse } from '../../common/dto/abstract-response.dto';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    // place a new order for items from a store
    @Post()
    async create(@Body() createOrderDto: CreateOrderDto): Promise<AbstractResponse<OrderCreatedResponseDto>> {
        const data = await this.orderService.create(createOrderDto);
        return AbstractResponse.success(data, 'Order created successfully');
    }

    // retrieve an existing order by its id
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AbstractResponse<OrderResponseDto>> {
        const data = await this.orderService.findOne(id);
        return AbstractResponse.success(data, 'Order retrieved successfully');
    }
}
