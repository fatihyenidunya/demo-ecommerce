export class Email {

    smtp: string;
    port: number;
    secure: boolean;
    userName: string;
    password: string;
    owner: string;
    _id: string;

}

export interface IEmail {
    smtp: string;
    port: number;
    secure: boolean;
    userName: string;
    password: string;
    owner: string;
    _id: string;
}
