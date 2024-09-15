import pLimit from 'p-limit';

import { options } from '../commands/program';
import { runScan } from '../utils/scan';
import { getUrlsFromFile, getUrlsFromPrompt } from '../utils/input';
import { exportResults } from '../utils/exporter';

import { isValidUrl } from '../utils/validators';
import { logError } from '../utils/logger';

export const main = async () => {
    let urls: string[] = options.urls || [];

    if (options.file) {
        urls = getUrlsFromFile(options.file);
    }

    if (urls.length === 0) {
        urls = await getUrlsFromPrompt();
    }

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
