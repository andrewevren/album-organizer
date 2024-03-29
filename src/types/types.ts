export interface AlbumSchema {
    id: string;
    artist: string;
    imgUrl: string;
    order: number;
    shelf: string;
    title: string;
    uid: string;
}

export interface ShelfSchema {
    id: string;
    order: number;
    name: string;
    uid: string;
}