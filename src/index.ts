import yargs, { Argv } from 'yargs';

const argv = yargs(process.argv.slice(2)).options({
  json: {
    demandOption: true,
    describe: 'Input JSON object',
    type: 'string',
  },
}).argv as { json: string };

try {
  const jsonObject = JSON.parse(argv.json);
  const outputString = JSON.stringify(jsonObject);
  console.log(outputString);
} catch (error: any) {
  console.error('Error processing JSON:', error.message);
}
