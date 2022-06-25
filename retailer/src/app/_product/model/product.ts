export class Product {


    id: number;
    title: string;
    turkishTitle: string;
    turkishTitleLower: string;
    freeCargo: boolean;
    description: string;
    image: [];
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
    listPrice: number;
    salePrice: number;
    priceCurrency: string;
    stock: string;
    orderQuantity: number;
    promotion: boolean;
    discount: number;

}

export interface IProduct {


    id: number;
    title: string;
    turkishTitle: string;
    turkishTitleLower: string;
    freeCargo: boolean;
    description: string;
    image: [];
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
    listPrice: number;
    salePrice: number;
    priceCurrency: string;
    stock: string;
    orderQuantity: number;


}
