const ts = require('typescript');
const fs = require('fs');

function reportDiagnostics(diagnostics) {
    let output = '';
    diagnostics.forEach(diagnostic => {
        if (diagnostic.file) {
            let { line, character } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            output += `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}\n`;
        } else {
            output += ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n") + "\n";
        }
    });
    return output;
}

const configFileName = ts.findConfigFile("./", ts.sys.fileExists, "tsconfig.json");
const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
const compilerOptions = ts.parseJsonConfigFileContent(configFile.config, ts.sys, "./").options;

const program = ts.createProgram(["src/index.ts", "src/models/Product.ts", "src/models/UserInventory.ts", "src/controllers/product.controller.ts"], compilerOptions);

const emitResult = program.emit();
const allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);

const report = reportDiagnostics(allDiagnostics);

if (report.length > 0) {
    fs.writeFileSync('ts-errors.txt', report);
    console.log('Errors written to ts-errors.txt');
} else {
    console.log('No Typescript errors found in targeted files.');
}
