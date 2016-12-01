import {readLineByLine} from "./utils/file.util";
import {IDENTIFIER_VALIDATOR, IDENTIFICATOR, NUMBER_VALIDATOR, CONST, UNKNOW_SYMBOL} from "./utils/const";
import {Atom} from "./entities/Atom";
import {AutomatFinit} from "./automative"
// import {} from "automative/build/app/AutomatFinit";
export class Analyzer {
    private sourceFile:string;
    private mapLanguageFile:string;
    private atoms:[string];
    private codeMappings:Map;
    private compileErrors:[string];
    private identifiers:Map;
    private constants:Map;
    private fip:[any];
    private idAuto: AutomatFinit;
    private numericAuto: AutomatFinit;

    constructor(sourceFile:string, mapLanguageFile:string) {
        this.sourceFile = sourceFile;
        this.mapLanguageFile = mapLanguageFile
        this.atoms = [];
        this.codeMappings = new Map();
        this.identifiers = new Map();
        this.constants = new Map();
        this.compileErrors = [];
        this.fip = [];
        this.idAuto = new AutomatFinit("./resources/id.automat.txt");
        this.numericAuto = new AutomatFinit("./resources/number.automat.txt");
    }

    public async parse() {
        await this.parseSourceFile(this.sourceFile);
        await this.mapCode(this.mapLanguageFile);
        console.log('Finish read source code');
    }

    public async build() {
        await this.idAuto.build();
        await this.numericAuto.build();
        for (let i = 0; i < this.atoms.length; i++) {
            let atom:String = this.atoms[i];
            let code:Number = this.checkSyntax(atom);
            if (code == UNKNOW_SYMBOL)
            //keep searching for another errors
                continue;
            //check if its a variable (identificator)
            let position:Number = -1;
            if (code == this.codeMappings.get(IDENTIFICATOR)) {
                if (this.identifiers.get(atom) == null) {
                    position = this.identifiers.size;
                    this.identifiers.set(atom, position);
                }
            }

            //check if its const
            if (code == this.codeMappings.get(CONST))
                if (this.constants.get(atom) == null) {
                    position = this.constants.size;
                    this.constants.set(atom, position);
                }
            this.fip.push(new Atom(atom, code, position));
        }
        return this.compileErrors.length == 0;
    }

    private checkSyntax(atom:string) {
        let mappedCode = this.codeMappings.get(atom);
        if (this.isIdentifier(atom) && !mappedCode) {
            if (atom.length < 255)
                return this.codeMappings.get(IDENTIFICATOR);
            this.compileErrors.push(`Atom ${atom} too long (max 255)`);
            return UNKNOW_SYMBOL;
        }

        if (this.isNumber(atom)) {
            return this.codeMappings.get(CONST);
        }

        if (mappedCode == UNKNOW_SYMBOL || mappedCode == null) {
            this.compileErrors.push(`Unknow symbol ${atom}.`);
        }

        return mappedCode;
    }

    private isIdentifier(atom:string) {
        //use regular expresion
        // let matches: [any] =  atom.match(IDENTIFIER_VALIDATOR);
        // let results: [any] = [];
        // for(let attr: any in matches) {
        //     results.push(matches[attr]);
        // }
        // return (results[1] == 0) && (results[0] == results[2]);

        //use automative
        return this.idAuto.checkSeq(atom);
    }

    private isNumber(atom:string) {
        //check with regular expression
        // return atom.match(NUMBER_VALIDATOR);
        //use automative
        return this.numericAuto.checkSeq(atom);
    }

    private async mapCode(mapLanguageFile:string) {
        let lines:[string] = await readLineByLine(mapLanguageFile);
        for (let i:Number = 0; i < lines.length; i++) {
            let attr:[string] = lines[i].split(" ");
            this.codeMappings.set(attr[0], attr[1])
        }
    }

    private async parseSourceFile(sourceFile:string) {
        let lines:[string] = await readLineByLine(sourceFile);
        for (let i:Number = 0; i < lines.length; i++) {
            let elements:[string] = lines[i].trim().split(" ");
            for (let j:Number = 0; j < elements.length; j++) {
                let element:string = elements[j];
                if (element.indexOf(";") > -1) {
                    this.addAtom(element.slice(0, element.length - 1))
                    this.addAtom(";")
                } else {
                    this.addAtom(element);
                }

            }
        }
    }

    private addAtom(atom:string) {
        if (atom.indexOf(",") > -1) {
            let atoms:[string] = atom.trim().split(" ")
            for (let i:Number = 0; i < atoms.length; i++) {
                this.atoms.push(atoms[i])
            }
            return
        }
        this.atoms.push(atom);
        return
    }

    public getCompileErrors() {
        return this.compileErrors;
    }

    public getConstants() {
        return this.constants;
    }

    public getIdentifiers() {
        return this.identifiers;
    }

    public getFip() {
        return this.fip;
    }
}