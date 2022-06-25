export class Message {

    _id: string;
    name: string;
    mail: string;
    phone: string;
    subject: string;
    message: string;
    type: boolean;
    answered: boolean;
    userName: string;
    answer: string;
    sendedBy: string;
    createdAt: Date;
    updatedAt: Date;

}

export interface IMessage {

    _id: string;
    name: string;
    mail: string;
    phone: string;
    subject: string;
    message: string;
    type: boolean;
    answered: boolean;
    userName: string;
    answer: string;
    sendedBy: string;
    createdAt: Date;
    updatedAt: Date;

}
