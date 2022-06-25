export class Newsletter {

    imageUrl: string;
    link: string;
    title: string;
    description: string;
    order: number;
    _id: string;
    startMonth :number;
    startDay :number;
    startYear :number;
    endMonth :number;
    endDay :number;
    endYear :number;
    type: string;
    amount: number;
    code: string;
    limit:number;
    subLimit:number;

}

export interface INewsletter {
    imageUrl: string;
    link: string;
    title: string;
    description: string;
    order: number;
    _id: string;
    startMonth :number;
    startDay :number;
    startYear :number;
    endMonth :number;
    endDay :number;
    endYear :number;
    type: string;
    amount: number;
    code: string;
}
