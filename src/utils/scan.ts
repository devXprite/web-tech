import Wappalyzer from 'wappalyzer';
import chalk from 'chalk';
import { sleep } from './index.js';

import type { ScanResult } from '../types';
import { LimitFunction } from 'p-limit';
import ProgressBar from 'progress';


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
    
    await wappalyzer.init();
    

    try {
        await Promise.all(
            urls.map((url, index) =>
                concurrencyLimit(async () => {
                    const result = await scanWebsite({ url, index });
                    results.push(result);
                    //   bar.tick();
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
