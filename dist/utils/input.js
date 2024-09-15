var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { isValidUrl } from './validators';
const getUrlsFromPrompt = () => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer.prompt([
        {
            type: 'input',
            name: 'urls',
            message: 'Enter URLs (space-separated):',
            validate: input => {
                const urls = input.split(' ').map(url => url.trim());
                return urls.every(isValidUrl) || 'One or more URLs are invalid. Please enter valid URLs.';
            },
        },
    ]);
    return answers.urls.split(' ').map((url) => url.trim());
});
const getUrlsFromFile = (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return fileContent
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
    }
    catch (error) {
        console.error(chalk.red(`Failed to read URLs from file: ${error === null || error === void 0 ? void 0 : error.message}`));
        process.exit(1);
    }
};
export { getUrlsFromPrompt, getUrlsFromFile };
//# sourceMappingURL=input.js.map