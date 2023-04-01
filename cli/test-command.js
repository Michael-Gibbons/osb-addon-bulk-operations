import { Command } from 'commander';
const program = new Command();

const testCommand =

program.command('test')
  .description('A test command added by osb-example-addon')
  .action((str, options) => {
    console.log("Hello from osb-example-addon!")
  });

export default testCommand