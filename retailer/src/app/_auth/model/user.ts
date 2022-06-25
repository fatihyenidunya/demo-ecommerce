export class User {
    name: string;
    surname: string;
    company: string;
    tcId:string;
    taxPlace:string;
    taxNo:string;
    openAddress:string;
    city:string;
    state:string;
    email: string;
    phone: string;
    password: string;
    confirm: string;

}

export interface IUser {
    name: string;
    surname: string;
    company: string;
    tcId:string;
    taxPlace:string;
    taxNo:string;
    phone: string;
    openAddress:string;
    email: string;
    password: string;
    confirm: string;

}
