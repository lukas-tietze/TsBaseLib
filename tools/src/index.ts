import yargs, { Arguments } from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .command(
    'update-common-files',
    'updates common files used in each project or creates them',
    (yargs) =>
      yargs
        .positional('project', {
          describe: 'project to apply to',
          demandOption: true,
          type: 'string',
        })
        .positional('src', {
          describe: 'template folder',
          default: '_template',
          type: 'string',
        }),
    async (argv: Arguments) => {
      const { updateCommonFilesAsync } = await import('./update-common-files/tool.js');
      console.log(argv);

      // updateCommonFilesAsync({
      // });
    }
  )
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    describe: 'more logging',
  })
  .option('silent', {
    alias: 's',
    type: 'boolean',
    describe: 'no logging',
  })
  .strictCommands()
  .strictOptions()
  .parseAsync();
