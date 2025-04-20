export class DayLabel {
    private readonly label: string;

    constructor(label: string) {
        this.label = label;
    }

    public value(): string {
        return this.label;
    }
}
