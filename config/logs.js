const logSymbols = require('log-symbols');
const chalk = require('chalk');

function error (msg) {
  console.log(logSymbols.error, chalk.red(msg));
}

function success (msg) {
  console.log(logSymbols.success, chalk.green(msg));
}

function info (msg) {
  console.log(logSymbols.info, chalk.gray(msg));
}

function warning (msg) {
  console.log(logSymbols.warning, chalk.yellow(msg));
}

module.exports = {
  warning,
  info,
  success,
  error
};
