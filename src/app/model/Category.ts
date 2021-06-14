export class Category {
    id: number | null;
    title: string;

    constructor(id: number | null, title: string) {
        this.id = id;
        this.title = title;
    }
}
