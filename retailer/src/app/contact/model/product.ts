export class Product {


    id: number;
    title: string;
    description: string;
    picture: string;
    category: string;
    volume: string;
    volumeEntity: string;
    boxSize: string;
    boxHeight: string;
    boxLength: string;
    boxWidth: string;
    boxEntity: string;
    quantityInBox: string;
    grossWeight: string;
    grossEntity: string;
    emptyBoxWeight: string;
    unitPrice: number;
    currency: string;
    stock: string;
    orderQuantity: number;
    promotion: boolean;

}

export interface IProduct {


    id: number;
    title: string;
    description: string;
    picture: string;
    category: string;
    volume: string;
    volumeEntity: string;
    boxSize: string;
    boxHeight: string;
    boxLength: string;
    boxWidth: string;
    boxEntity: string;
    quantityInBox: string;
    grossWeight: string;
    grossEntity: string;
    emptyBoxWeight: string;
    unitPrice: number;
    currency: string;
    stock: string;
    orderQuantity: number;

}
