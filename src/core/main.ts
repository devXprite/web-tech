import pLimit from 'p-limit';

import { options } from '../commands/program.js';
import { runScan } from '../utils/scan.js';
import { getUrlsFromFile, getUrlsFromPrompt } from '../utils/input.js';
import { exportResults } from '../utils/exporter.js';

import { isValidUrl } from '../utils/validators.js';
import { logError } from '../utils/logger.js';
import figlet from 'figlet';

export const main = async () => {

    console.log(figlet.textSync('Wappalyzer CLI'));

    let urls: string[] = options.urls || [];

    if (options.file) urls = getUrlsFromFile(options.file);
    if (urls.length === 0) urls = await getUrlsFromPrompt();


    urls = urls.filter(isValidUrl);
    if (urls.length === 0) {
        logError('No valid URLs provided.');
        process.exit(1);
    }

    const concurrencyLimit = pLimit(parseInt(options.concurrency, 10));
    const delay = parseInt(options.delay, 10);

    try {
        const results = await runScan({ urls, concurrencyLimit, delay });
        if (options.output) exportResults(results, options.output);
    } catch (error) {
        logError(`Failed to scan websites: ${(error as Error).message}`);
    }
};
