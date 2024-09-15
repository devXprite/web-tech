import chalk from 'chalk';
import { options } from '../commands/program';

const logInfo = (message: string): void => {
    if (!options.quiet) {
        console.log(chalk.blue(message));
    }
};

const logVerbose = (message: string): void => {
    if (options.verbose) {
        console.log(chalk.gray(message));
    }
};

const logError = (message: string): void => {
    console.error(chalk.red(message));
};

const logSuccess = (message: string): void => {
    console.log(chalk.green(message));
};

export { logInfo, logVerbose, logError, logSuccess };
