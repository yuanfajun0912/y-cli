#!/usr/bin/env node

const inquirer = require('inquirer');
const { exitProcess } = require('../../config/utils');
const log = require('../../config/logs');
const { LOG_HEADER } = require('./constants')
const wbBizApp = require('./wbBizApp')

const main = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: '请选择模版类型',
      loop: false,
      pageSize: 10,
      choices: [
        {
          name: 'wb-bizApp',
          value: 'wb-bizApp'
        }
      ]
    }
  ]);
  switch (answer.type) {
    case 'wb-bizApp':
      wbBizApp()
      break;

    default:
      log.error(`${LOG_HEADER}未找到模版${type}`)
      exitProcess()
      break;
  }
}

module.exports = main;