import fs from 'fs';
import path from 'path';
import { ScanResult } from '../types';
import { logSuccess, logError } from './logger.js';

export const exportResults = (results: ScanResult[], filePath: string): void => {
    const ext = path.extname(filePath).toLowerCase();

    try {
        if (ext === '.txt') {
            const txtData = results.map(r => `${r.url} - ${r.technologies}`).join('\n');
            fs.writeFileSync(filePath, txtData);
        } else if (ext === '.json') {
            fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
        } else if (ext === '.csv') {
            const csvData = results.map(r => `${r.url},${r.technologies}`).join('\n');
            fs.writeFileSync(filePath, csvData);
        } else {
            logError('Unsupported file format. Use .json or .csv');
            return;
        }
        logSuccess(`Results saved to ${filePath}`);
    } catch (error) {
        logError(`Failed to export results: ${(error as Error).message}`);
    }
};
