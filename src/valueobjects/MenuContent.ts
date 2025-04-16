export class MenuContent {
    private readonly content: string;

    constructor(content: string) {
        this.content = content;
    }

    public value(): string {
        return this.content;
    }
}
