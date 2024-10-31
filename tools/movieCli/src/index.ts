import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createHandler } from './composition/services';
import * as common from './constants/common';
import * as processIssue from './constants/processIssue';

yargs(hideBin(process.argv))
  .usage('Usage: movie-cli <command> [options]')
  .command(
    processIssue.command,
    processIssue.description,
    (yargs) =>
      yargs
        .option(processIssue.issueNumberName, {
          alias: processIssue.issueNumberAlias,
          describe: processIssue.issueNumberDescribe,
          type: 'number',
          demandOption: true,
        })
        .option(common.optionVerboseName, { alias: common.optionVerboseAlias, description: common.optionVerboseDescription, type: 'boolean', default: false }),
    (args) => createHandler(args.verbose).processIssue(args)
  )
  .parse();
