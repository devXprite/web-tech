import Wappalyzer from 'wappalyzer';
import chalk from 'chalk';
import { sleep } from '.';

import type { ScanResult } from '../types';
import { LimitFunction } from 'p-limit';

interface ScanWebsiteParams {
    url: string;
    index: number;
}

interface RunScan {
    urls: string[];
    concurrencyLimit: LimitFunction;
    delay: number;
}

const wappalyzer = new Wappalyzer();

const scanWebsite = async ({ url, index }: ScanWebsiteParams): Promise<ScanResult> => {
    try {
        const website = await wappalyzer.open(url);
        const analysisResults = await website.analyze();
        const technologies = analysisResults.technologies.map(({ name }) => name).join(', ');

        console.log(chalk.blue.bold(`\n[${index + 1}] Scanning: ${chalk.green(url)}`));
        console.log(chalk.yellow(`Technologies detected: ${chalk.magenta(technologies)}\n`));

        return { url, technologies };
    } catch (error) {
        console.error(chalk.red(`Error while scanning ${url}`));
        return { url, technologies: 'Error' };
    }
};

const runScan = async ({ urls, concurrencyLimit, delay }: RunScan): Promise<ScanResult[]> => {
    const results: ScanResult[] = [];

    for (const [index, url] of urls.entries()) {
        await concurrencyLimit(() => scanWebsite({ url, index }));
        await sleep(delay);
    }

    return results;
};

export { scanWebsite, runScan };
