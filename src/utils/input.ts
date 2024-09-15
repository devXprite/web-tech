import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { isValidUrl } from './validators';

const getUrlsFromPrompt = async (): Promise<string[]> => {
    const answers = await inquirer.prompt([
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

    return answers.urls.split(' ').map((url: string) => url.trim());
};

const getUrlsFromFile = (filePath: string): string[] => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return fileContent
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
    } catch (error) {
        console.error(chalk.red(`Failed to read URLs from file: ${(error as Error)?.message}`));
        process.exit(1);
    }
};
export { getUrlsFromPrompt, getUrlsFromFile };
