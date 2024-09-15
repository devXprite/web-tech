var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pLimit from 'p-limit';
import { options } from '../commands/program';
import { runScan } from '../utils/scan';
import { getUrlsFromFile, getUrlsFromPrompt } from '../utils/input';
import { exportResults } from '../utils/exporter';
import { isValidUrl } from '../utils/validators';
import { logError } from '../utils/logger';
export const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let urls = options.urls || [];
    if (options.file) {
        urls = getUrlsFromFile(options.file);
    }
    if (urls.length === 0) {
        urls = yield getUrlsFromPrompt();
    }
    urls = urls.filter(isValidUrl);
    if (urls.length === 0) {
        logError('No valid URLs provided.');
        process.exit(1);
    }
    const concurrencyLimit = pLimit(parseInt(options.concurrency, 10));
    const delay = parseInt(options.delay, 10);
    try {
        const results = yield runScan({ urls, concurrencyLimit, delay });
        if (options.output)
            exportResults(results, options.output);
    }
    catch (error) {
        logError(`Failed to scan websites: ${error.message}`);
    }
});
//# sourceMappingURL=main.js.map