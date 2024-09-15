import _ from 'lodash';
import pLimit from 'p-limit';
import figlet from 'figlet';

import { options } from '../commands/program.js';
import { runScan } from '../utils/scan.js';
import { getUrlsFromFile, getUrlsFromPrompt } from '../utils/input.js';
import { exportResults } from '../utils/exporter.js';

import { isValidUrl } from '../utils/validators.js';
import { logError, logInfo, logSuccess } from '../utils/logger.js';
import banner from '../utils/banner.js';

export const main = async () => {
    banner();
    let urls: string[] = options.urls || [];

    if (options.file) urls = getUrlsFromFile(options.file);
    if (urls.length === 0) urls = await getUrlsFromPrompt();

    urls = _.uniq(urls).filter(isValidUrl);
    if (urls.length === 0) {
        logError('No valid URLs provided.');
        process.exit(1);
    }

    logInfo(`Found ${urls.length} URLs to scan...\n`);

    const concurrencyLimit = pLimit(parseInt(options.concurrency, 10));
    const delay = parseInt(options.delay, 10);

    try {
        const results = await runScan({ urls, concurrencyLimit, delay });
        if (options.output) exportResults(results, options.output);
    } catch (error) {
        logError(`Failed to scan websites: ${(error as Error).message}`);
    }
};
