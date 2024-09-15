import chalk from 'chalk';
import { options } from '../commands/program.js';
const logInfo = (message) => {
    if (!options.quiet) {
        console.log(chalk.blue(message));
    }
};
const logVerbose = (message) => {
    if (options.verbose) {
        console.log(chalk.gray(message));
    }
};
const logError = (message) => {
    console.error(chalk.red(message));
};
const logSuccess = (message) => {
    console.log(chalk.green(message));
};
export { logInfo, logVerbose, logError, logSuccess };
//# sourceMappingURL=logger.js.map