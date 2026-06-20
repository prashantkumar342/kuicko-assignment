import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoreService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll() {
        return this.prisma.store.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }

    async findOne(id: string) {
        const store = await this.prisma.store.findUnique({
            where: { id },
        });

        if (!store) {
            throw new NotFoundException('Store not found');
        }

        return store;
    }

    async findStoreItems(storeId: string) {
        const store = await this.prisma.store.findUnique({
            where: { id: storeId },
        });

        if (!store) {
            throw new NotFoundException('Store not found');
        }

        const storeItems = await this.prisma.storeItem.findMany({
            where: {
                storeId,
            },
            select: {
                id: true,
                itemId: true,
                price: true,
                stock: true,
                item: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: {
                item: {
                    name: 'asc',
                },
            },
        });

        return storeItems.map(si => ({
            storeItemId: si.id,
            itemId: si.itemId,
            name: si.item.name,
            price: Number(si.price),
            stock: si.stock
        }));
    }
}