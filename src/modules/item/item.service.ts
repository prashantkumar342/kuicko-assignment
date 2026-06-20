import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.item.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
}
