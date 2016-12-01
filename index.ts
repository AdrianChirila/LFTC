/*
    Start my custom language
 */
import {Analyzer} from "./app/Analyzer";
import {writeToFile, clearFile} from "./app/utils/file.util";
export class Start {
    private constFileTable: string = "./resources/const.symbol.tabel.txt";
    private idFileTable: string = "./resources/id.symbol.tabel.txt";
    private fipFile: string = "./resources/fip.txt";

    constructor() {
    }

    async run() {

        console.log("Start compiling custom programming language")
        let analyzer: Analyzer = await new Analyzer('./resources/source.code.txt', './resources/language.txt')
        await analyzer.parse();
        let validSyntax: Boolean = await analyzer.build();
        if (validSyntax) {
            console.log('Finish compiling, no errors!');
            await clearFile(this.constFileTable);
            await writeToFile(analyzer.getConstants(), this.constFileTable);
            await clearFile(this.idFileTable);
            await writeToFile(analyzer.getIdentifiers(), this.idFileTable);
            await clearFile(this.fipFile);
            await writeToFile(analyzer.getFip(), this.fipFile);
        } else {
            let errors: [string] = analyzer.getCompileErrors();
            for(let i: Number = 0; i < errors.length; i ++) {
                console.log(errors[i]);
            }
        }
    }
}

try {
    new Start().run();
} catch (err) {
    console.log('Could not run app ', err)
}
