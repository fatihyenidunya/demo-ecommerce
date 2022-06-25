export class Contact {

    _id: string;
    addressName: string;
    name: string;
    lastName: string;
    identityNumber:string;
    email: string;
    phone: string;
    company: string;
    addressOne: string;
    addressTwo: string;
    zipCode: string;
    city: string;
    state: string;
    countryCode: string;
    country: string;
    tcId:string;
    taxNo:string;



}

export interface IContact {
    _id: string;
    addressName: string;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    company: string;
    addressOne: string;
    addressTwo: string;
    zipCode: string;
    city: string;
    state: string;
    countryCode: string;
    country: string;
    tcId:string;
    taxNo:string;
}
