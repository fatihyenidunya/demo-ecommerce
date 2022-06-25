export class Cart {


    id: number;
    customerId: string;
    productId: string;
    picture: string;
    title: string;
    unit: number;
    unitPrice: number;
    size: string;
    currency: string;
    totalPrice: number;





}

export interface ICart {

    id: number;
    customerId: string;
    productId: number;
    picture: string;
    title: string;
    unit: number;
    unitPrice: number;
    size: string;
    currency: string;
    totalPrice: number;
}