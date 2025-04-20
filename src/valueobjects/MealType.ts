export class MealType {
    private readonly type: string;

    constructor(type: string) {
        this.type = type;
    }

    public value(): string {
        return this.type;
    }
}
