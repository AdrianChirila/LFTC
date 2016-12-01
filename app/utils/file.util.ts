const fs = require('fs');
var path = require('path');

export function readLineByLine(fileName:string) {
    return new Promise((resolve:any, reject:any) => {
        let lines:[string] = [];
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(fileName)
        });

        lineReader.on('line', function (line:string) {
            lines.push(line)
        });

        lineReader.on('close', function () {
            resolve(lines)
        });
    })
}

export async function writeToFile(source:any, filePath:string) {
    return new Promise((resolve:any, reject:any) => {
        if (source instanceof Map) {
            let size:Number = source.size;
            let currentLineNumber:Number = -1;
            source.forEach((value, key) => {
                fs.appendFile(filePath, `${value}, ${key} \n`, function (err:any) {
                    if (err)
                        reject(err);
                    currentLineNumber++;
                    if (currentLineNumber == size -1) {
                        resolve();
                    }
                });
            })
        } else if (source instanceof Array) {
            let size:Number = source.size;
            let currentLineNumber:Number = -1;
            source.forEach((value: any) => {
                fs.appendFile(filePath, `${value.toString()} \n`, function (err:any) {
                    if (err)
                        reject(err);
                    currentLineNumber++;
                    if (currentLineNumber == size -1) {
                        resolve();
                    }
                });
            })
        }
    });
}

export async function clearFile(filePath:string) {
    return new Promise((resolve:any, reject:any) => {
        fs.truncate(filePath, 0, (err:any) => {
            if (err)
                reject(err)
            resolve();
        });
    })
}



