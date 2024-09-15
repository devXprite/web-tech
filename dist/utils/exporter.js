import fs from 'fs';
import path from 'path';
import { logSuccess, logError } from './logger.js';
export const exportResults = (results, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    try {
        if (ext === '.json') {
            fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
        }
        else if (ext === '.csv') {
            const csvData = results.map(r => `${r.url},${r.technologies}`).join('\n');
            fs.writeFileSync(filePath, csvData);
        }
        else {
            logError('Unsupported file format. Use .json or .csv');
            return;
        }
        logSuccess(`Results saved to ${filePath}`);
    }
    catch (error) {
        logError(`Failed to export results: ${error.message}`);
    }
};
//# sourceMappingURL=exporter.js.map