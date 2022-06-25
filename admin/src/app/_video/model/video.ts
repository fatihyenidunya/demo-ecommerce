export class Video {
    _id: string;
    videoUrl: string;
    title: string;
    order: number;
    mainPage: boolean;
    publish: boolean;
}

export interface IVideo {
    _id: string;
    videoUrl: string;
    title: string;
    order: number;
    mainPage: boolean;
    publish: boolean;
}
