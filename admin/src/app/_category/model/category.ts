export class Category {
    id: number;
    name: string;
    turkishName: string;
    nameLower: string;
    isTopCategory: boolean;
    topCategoryId: number;
    topCategoryName: string;
    topCategoryNameLower: string;
    publish: boolean=true;
    title: string;
    metaDescription: string;
    _id: string;
    mainPage: boolean=false;

}

export interface ICategory {
    id: number;
    name: string;
    turkishName: string;
    nameLower: string;
    isTopCategory: boolean;
    topCategoryId: number;
    topCategoryName: string;
    topCategoryNameLower: string;
    publish: boolean;
    title: string;
    metaDescription: string;
    _id: string;
}
