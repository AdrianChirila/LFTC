export class Tranzition {
    private value: string;
    private initialState: string;
    private finalState: string;
    constructor(initialState: string, finalState: string, value: string) {
        this.value = value;
        this.initialState = initialState;
        this.finalState = finalState;
    }
    
    public toString() {
        return `${this.initialState} ${this.finalState} ${this.value}`;
    }
    
    public getInitialState() {
        return this.initialState;
    }
    
    public getValue() {
        return this.value;
    }

    getFinalState() {
        return this.finalState;
    }
}