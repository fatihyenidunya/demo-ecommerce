export class Product {


    id: number;
    company: string;
    title: string;
    color: string;
    size: string;
    sizes: any;
    colors:any;
    order: number;
    description: string;
    metaDescription: string;
    turkishDescription: string;
    listPrice: number;
    salePrice: number;
    publish: boolean;
    priceCurrency: string;
    imageUrl: string;
    image;
    categoryId: string;
    productCode:string;
    volume: string;
    quantityInBox: string;
    grossWeight: string;
    unitPrice: string;
    currency: string;
    stock: number;
    volumeEntity: string;
    boxHeight: string;
    boxLength: string;
    boxWidth: string;
    boxEntity: string;
    grossEntity: string;
    emptyBoxWeight: string;
    turkishTitle: string;
    mainPage: boolean=false;
    freeCargo: boolean;
    cargoPrice: number;
    _id: string;
    categoryNameLower: string;
    categoryName: string;
    barcode:string;

}

export interface IProduct {


    id: number;
    title: string;
    color: string;
    size: string;
    description: string;
    metaDescription: string;
    turkishDescription: string;
    listPrice: number;
    salePrice: number;
    publish: boolean;
    priceCurrency: string;
    imageUrl: string;
    image;
    categoryId: string;
    categoryNameLower: string;
    volume: string;
    quantityInBox: string;
    grossWeight: string;
    unitPrice: string;
    currency: string;
    stock: number;
    volumeEntity: string;
    boxHeight: string;
    boxLength: string;
    boxWidth: string;
    boxEntity: string;
    grossEntity: string;
    emptyBoxWeight: string;
    turkishTitle: string;
    freeCargo: boolean;
    cargoPrice: number;
    _id: string;


}
