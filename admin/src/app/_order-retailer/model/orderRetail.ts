export class OrderRetail {


    id: number;
    customerId: string;
    customer: string;
    createdAt: Date;
    grandTotal: number;
    currency: string;
    note: string;
    status: string;
    isApproved: boolean;
    country: string;
    userName: string;
    contact: {};
    products: [];

}

export interface IOrderRetail {



    id: number;
    customerId: string;
    customer: string;
    createdAt: Date;
    grandTotal: number;
    currency: string;
    note: string;
    status: string;
    isApproved: boolean;
    country: string;
    userName: string;
    contact: {};
    products: [];
}
