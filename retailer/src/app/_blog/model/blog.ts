export class Blog {

    imageUr: string;
    title: string;
    summary: string;
    description: string;
    order: string;
    writer: string;
    mainPage: boolean;
    publish: boolean;
    _id: string;

}

export interface IBlog {
    imageUr: string;
    title: string;
    summary: string;
    description: string;
    order: string;
    writer: string;
    mainPage: boolean;
    publish: boolean;
    _id: string;
}
