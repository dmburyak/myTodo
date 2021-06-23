export class Category {
    id?: number | null;
    title: string;

    constructor(title: string, id?: number | null) {
        this.id = id;
        this.title = title;
    }
}
