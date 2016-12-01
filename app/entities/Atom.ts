export class Atom {
    private content: string;
    private code: Number;
    private position: Number;

    public constructor(content: string, code: Number, position: Number) {
        this.content = content;
        this.code = code;
        this.position = position;
    }

    public toString() {
        return `${this.code} ${this.position}`
    }
}