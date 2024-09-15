import Wappalyzer from 'wappalyzer';
import chalk from 'chalk';
import { sleep } from './index.js';

import type { ScanResult } from '../types';
import { LimitFunction } from 'p-limit';
import ProgressBar from 'progress';

interface ScanWebsiteParams {
    url: string;
    index: number;
    bar: ProgressBar;
}

interface RunScan {
    urls: string[];
    concurrencyLimit: LimitFunction;
    delay: number;
}

const wappalyzer = new Wappalyzer();

const scanWebsite = async ({ url, index, bar }: ScanWebsiteParams): Promise<ScanResult> => {
    try {
        const website = await wappalyzer.open(url);
        const analysisResults = await website.analyze();
        const technologies = analysisResults.technologies.map(({ name }) => name).join(', ');

        bar.interrupt(chalk.blue.bold(`\n[${index + 1}] Scanning: ${chalk.green(url)}`));

        bar.interrupt(chalk.yellow(`Technologies detected: ${chalk.magenta(technologies)}\n`));

        return { url, technologies };
    } catch (error) {
        console.error(chalk.red(`Error while scanning ${url}`));
        return { url, technologies: 'Error' };
    }
};

const runScan = async ({ urls, concurrencyLimit, delay }: RunScan): Promise<ScanResult[]> => {
    const results: ScanResult[] = [];

    await wappalyzer.init();

    const bar = new ProgressBar(
        `Scanning | ${chalk.whiteBright(':bar')} | ${chalk.cyanBright(':percent')} | ${chalk.gray(':etas')}`,
        {
            total: urls.length,
            complete: '\u2588',
            incomplete: '\u2591',
            width: 40,
            clear: true,
        }
    );

    try {
        await Promise.all(
            urls.map((url, index) =>
                concurrencyLimit(async () => {
                    const result = await scanWebsite({ url, index, bar });
                    results.push(result);
                    bar.tick();
                    await sleep(delay);
                })
            )
        );
    } finally {
        await wappalyzer.destroy();
    }

    return results;
};

export { scanWebsite, runScan };
