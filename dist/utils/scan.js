var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Wappalyzer from 'wappalyzer';
import chalk from 'chalk';
import { sleep } from './index.js';
import ProgressBar from 'progress';
const wappalyzer = new Wappalyzer();
const scanWebsite = (_a) => __awaiter(void 0, [_a], void 0, function* ({ url, index, bar }) {
    try {
        const website = yield wappalyzer.open(url);
        const analysisResults = yield website.analyze();
        const technologies = analysisResults.technologies.map(({ name }) => name).join(', ');
        bar.interrupt(chalk.blue.bold(`\n[${index + 1}] Scanning: ${chalk.green(url)}`));
        bar.interrupt(chalk.yellow(`Technologies detected: ${chalk.magenta(technologies)}\n`));
        return { url, technologies };
    }
    catch (error) {
        console.error(chalk.red(`Error while scanning ${url}`));
        return { url, technologies: 'Error' };
    }
});
const runScan = (_a) => __awaiter(void 0, [_a], void 0, function* ({ urls, concurrencyLimit, delay }) {
    const results = [];
    yield wappalyzer.init();
    const bar = new ProgressBar(`Scanning | ${chalk.whiteBright(':bar')} | ${chalk.cyanBright(':percent')} | ${chalk.gray(':etas')}`, {
        total: urls.length,
        complete: '\u2588',
        incomplete: '\u2591',
        width: 40,
        clear: true,
    });
    try {
        yield Promise.all(urls.map((url, index) => concurrencyLimit(() => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield scanWebsite({ url, index, bar });
            results.push(result);
            bar.tick();
            yield sleep(delay);
        }))));
    }
    finally {
        yield wappalyzer.destroy();
    }
    return results;
});
export { scanWebsite, runScan };
//# sourceMappingURL=scan.js.map