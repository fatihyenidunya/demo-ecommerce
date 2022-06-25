export class Blog {

    imageUrl: string;
    title: string;
    metaDescription: string;
    summary: string;
    description: string;
    mainPage: boolean;
    publish: boolean;
    order: number;
    writer: string;
    _id: string;

}

export interface IBlog {
    imageUrl: string;
    title: string;
    metaDescription: string;
    summary: string;
    description: string;
    mainPage: boolean;
    publish: boolean;
    order: number;
    writer: string;
    _id: string;
}
