import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createOrderDto: CreateOrderDto) {
        const { storeId, items } = createOrderDto;

        if (!items || items.length === 0) {
            throw new BadRequestException('Order must contain at least one item');
        }

        const store = await this.prisma.store.findUnique({
            where: { id: storeId },
        });

        if (!store) {
            throw new BadRequestException('Store does not exist');
        }

        const storeItemIds = items.map((i) => i.storeItemId);
        const uniqueStoreItemIds = new Set(storeItemIds);

        if (storeItemIds.length !== uniqueStoreItemIds.size) {
            throw new BadRequestException('Duplicate store items in order.');
        }

        const storeItems = await this.prisma.storeItem.findMany({
            where: {
                id: { in: Array.from(uniqueStoreItemIds) },
                storeId,
            },
        });

        if (storeItems.length !== uniqueStoreItemIds.size) {
            throw new BadRequestException('One or more items do not belong to the selected store.');
        }

        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    storeId,
                    orderItems: {
                        create: items.map((i) => ({
                            storeItemId: i.storeItemId,
                            quantity: i.quantity,
                        })),
                    },
                },
                include: {
                    orderItems: true,
                },
            });
            return newOrder;
        });

        return {
            id: order.id,
            storeId: order.storeId,
            createdAt: order.createdAt,
            items: order.orderItems.map((oi) => ({
                storeItemId: oi.storeItemId,
                quantity: oi.quantity,
            })),
        };
    }

    async findOne(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                orderItems: {
                    include: {
                        storeItem: {
                            include: {
                                item: true,
                            },
                        },
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return {
            id: order.id,
            store: order.store,
            items: order.orderItems.map((oi) => ({
                name: oi.storeItem.item.name,
                price: Number(oi.storeItem.price),
                quantity: oi.quantity,
            })),
        };
    }
}
