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
import { sleep } from '.';
const wappalyzer = new Wappalyzer();
const scanWebsite = (_a) => __awaiter(void 0, [_a], void 0, function* ({ url, index }) {
    try {
        const website = yield wappalyzer.open(url);
        const analysisResults = yield website.analyze();
        const technologies = analysisResults.technologies.map(({ name }) => name).join(', ');
        console.log(chalk.blue.bold(`\n[${index + 1}] Scanning: ${chalk.green(url)}`));
        console.log(chalk.yellow(`Technologies detected: ${chalk.magenta(technologies)}\n`));
        return { url, technologies };
    }
    catch (error) {
        console.error(chalk.red(`Error while scanning ${url}`));
        return { url, technologies: 'Error' };
    }
});
const runScan = (_a) => __awaiter(void 0, [_a], void 0, function* ({ urls, concurrencyLimit, delay }) {
    const results = [];
    for (const [index, url] of urls.entries()) {
        yield concurrencyLimit(() => scanWebsite({ url, index }));
        yield sleep(delay);
    }
    return results;
});
export { scanWebsite, runScan };
//# sourceMappingURL=scan.js.map