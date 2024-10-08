#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .command('mtest')
  .description('在个人分支上将改动merge进test分支')
  .argument('<message>', 'commit的提交信息')
  .action((message) => {
    require('../lib/mtest')(message)
  });

program.parse(process.argv);