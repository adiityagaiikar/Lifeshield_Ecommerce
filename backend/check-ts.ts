import { execSync } from 'child_process';
import * as fs from 'fs';

try {
    const output = execSync('npx tsc --noEmit', { encoding: 'utf-8' });
    fs.writeFileSync('errors.log', 'No errors:\n' + output);
    console.log('Success, wrote to errors.log');
} catch (err: any) {
    fs.writeFileSync('errors.log', 'Errors found:\n' + err.stdout + '\n' + err.stderr);
    console.log('Failed, wrote to errors.log');
}
