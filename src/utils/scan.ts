import Wappalyzer from 'wappalyzer';
import chalk from 'chalk';
import { sleep } from './index.js';

import type { ScanResult } from '../types';
import { LimitFunction } from 'p-limit';
import ProgressBar from 'progress';

interface ScanWebsiteParams {
    url: string;
    bar: ProgressBar;
}

interface RunScan {
    urls: string[];
    concurrencyLimit: LimitFunction;
    delay: number;
}

const wappalyzer = new Wappalyzer();

const scanWebsite = async ({ url, bar }: ScanWebsiteParams): Promise<ScanResult> => {
    try {
        const website = await wappalyzer.open(url);
        const analysisResults = await website.analyze();
        const technologies = analysisResults.technologies.map(({ name }) => name).join(', ');

        bar.interrupt(chalk.blue.bold(`Website: ${chalk.green(url)}`));

        if (technologies === '') bar.interrupt(chalk.gray(`No technologies detected\n`));
        else bar.interrupt(chalk.yellow(`Technologies detected: ${chalk.magenta(technologies)}\n`));

        // bar.interrupt(chalk.blue.bold(`\n${chalk.green(url)}: ${chalk.magenta(technologies)}`));
        return { url, technologies };
    } catch (error) {
        bar.interrupt(chalk.blue.bold(`Website: ${chalk.red(url)}\n`));

        return { url, technologies: 'Error' };
    }
};

const runScan = async ({ urls, concurrencyLimit, delay }: RunScan): Promise<ScanResult[]> => {
    const results: ScanResult[] = [];

    await wappalyzer.init();

    const bar = new ProgressBar(
        `Scanning | ${chalk.whiteBright(':bar')} | ${chalk.cyanBright(':percent')} | ETA: ${chalk.gray(':etas')}`,
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
            urls.map(url =>
                concurrencyLimit(async () => {
                    const result = await scanWebsite({ url, bar });
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
