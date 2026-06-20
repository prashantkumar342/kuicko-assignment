import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsUUID, Min, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  storeItemId: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items: OrderItemDto[];
}
