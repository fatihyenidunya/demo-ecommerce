export class Comment {


    productId: string;
    customerId: string;
    comment: string;
    ranking: number;
    publish: boolean;
    _id: string;

}

export interface IComment {

    productId: string;
    customerId: string;
    comment: string;
    ranking: number;
    publish: boolean;
    _id: string;
}
