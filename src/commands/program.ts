import { Command } from 'commander';

const program = new Command();

program
  .version('1.1.0')
  .description('Website technology analyzer using Wappalyzer')
  .option('-u, --urls <urls...>', 'List of URLs to analyze')
  .option('-c, --concurrency <number>', 'Number of concurrent requests (default: 2)', '2')
  .option('-d, --delay <ms>', 'Delay between each scan in milliseconds (default: 500)', '500')
  .option('-f, --file <path>', 'Path to file with URLs (one per line)')
  .option('-o, --output <path>', 'Path to output results in JSON or CSV')
  .parse(process.argv);

export const options = program.opts();
