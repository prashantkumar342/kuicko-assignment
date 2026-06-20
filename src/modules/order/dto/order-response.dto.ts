export class OrderItemResponseDto {
  name: string;
  price: number;
  quantity: number;
}

export class OrderStoreResponseDto {
  id: string;
  name: string;
}

export class OrderResponseDto {
  id: string;
  store: OrderStoreResponseDto;
  items: OrderItemResponseDto[];
}

export class OrderCreatedItemDto {
  storeItemId: string;
  quantity: number;
}

export class OrderCreatedResponseDto {
  id: string;
  storeId: string;
  createdAt: Date;
  items: OrderCreatedItemDto[];
}
