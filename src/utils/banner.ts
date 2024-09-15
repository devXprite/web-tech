import chalk from 'chalk';
import figlet from 'figlet';
import updateNotifier from 'update-notifier';
import packageJson from '../../package.json' assert { type: 'json' };

const banner = () => {
    const { version } = packageJson;

    console.clear();
    console.log('\n');
    console.log(
        chalk.bold.cyanBright(
            figlet.textSync('Tech Analyzer', {
                font: 'Slant',
            })
        )
    );

    console.log(`${' '.repeat(44)} ${chalk.bold('Version:')} ${chalk.greenBright(version)}`);

    updateNotifier({ pkg: packageJson }).notify();

    console.log('\n\n');
};

export default banner;
