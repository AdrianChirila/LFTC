import {readLineByLine} from "../utils";
import {read} from "../utils";
import {INITIAL_STATE, FINAL_STATE} from "../utils";
import {Tranzition} from "./Tranzition";
import {lowLettersAlphabet, upperLettersAlphabet, digitAlphabet, nonZeroDigitAlphabet} from "../utils";
export class AutomatFinit {
    private inputFileName:string;
    private states:[any];
    private initialState:string;
    private finalStates:[string];
    private tranzitions:[Tranzition];
    private alphabet:Set;

    constructor(inputFileName:string) {
        this.inputFileName = inputFileName;
        this.states = [];
        this.finalStates = [];
        this.tranzitions = [];
        this.alphabet = new Set();
    }

    async start() {

    }

    async build() {
        console.log("Build automative!");
        let lines:[any] = await readLineByLine(this.inputFileName);
        this.states = lines[0].split(" ");
        let statuses:[any] = [];
        let splitStatusLine:[any] = lines[1].split(" ");
        for (let i:Number = 0; i < splitStatusLine.length; i++) {
            statuses.push(parseInt(splitStatusLine[i]));
        }

        for (let i:Number = 0; i < statuses.length; i++) {
            if (statuses[i] == INITIAL_STATE) {
                this.initialState = this.states[i];
            }
            else if (statuses[i] == FINAL_STATE)
                this.finalStates.push(this.states[i]);
        }

        let tranzitionCount:number = parseInt(lines[2]);

        function insertFromAlphabet(alphabet:string, transision: [string], that: any) {
            for (let i = 0; i < alphabet.length; i++) {
                that.tranzitions.push(new Tranzition(transision[0], transision[1], alphabet[i]));
                that.alphabet.add(alphabet[i]);
            }
        }
        for (let i:Number = 0; i < tranzitionCount; i++) {
            //check for multiple matching, ex: a..z, 0..9
            let currentLine:string = lines[i + 3];
            let tranzition:[string] = currentLine.split(" ");
            if (currentLine.includes('..')) {
                let firstMatching: string = currentLine[6];
                switch (firstMatching) {
                    case 'a':
                        insertFromAlphabet(lowLettersAlphabet, tranzition, this);
                        break;
                    case 'A':
                        insertFromAlphabet(upperLettersAlphabet, tranzition, this);
                        break;
                    case '0':
                        insertFromAlphabet(digitAlphabet, tranzition, this);
                        break;
                    case '1':
                        insertFromAlphabet(nonZeroDigitAlphabet, tranzition, this);
                        break;
                }
                continue;
            }
            this.tranzitions.push(new Tranzition(tranzition[0], tranzition[1], tranzition[2]));
            this.alphabet.add(tranzition[2]);
        }
    }

    public checkSeq(seq:string) {
        let startState:string = this.initialState;
        let finalState:string = "";
        let valid:Boolean = true;
        for (let i:Number = 0; i < seq.length; i++) {
            let char:any = seq[i];
            let next:string = "";
            for (let j:Number = 0; j < this.tranzitions.length; j++) {
                let tranzition:Tranzition = this.tranzitions[j];
                if (tranzition.getInitialState() == startState && tranzition.getValue() == char) {
                    next = tranzition.getFinalState();
                    break;
                }
            }
            if (next == "") {
                return false;
            }

            if (this.finalStates.indexOf(next) > -1 && i == seq.length - 1) {
                finalState = next;
                break;
            }

            startState = next;
            finalState = next;
        }
        if (this.finalStates.indexOf(finalState) < 0)
            return false;
        return true;
    }

    public getStates() {
        return this.states;
    }

    public getAlphabet() {
        return this.alphabet;
    }

    public getInitialState() {
        return this.initialState;
    }

    public getTranzitions() {
        return this.tranzitions;
    }

    public getFinalStates() {
        return this.finalStates;
    }
}