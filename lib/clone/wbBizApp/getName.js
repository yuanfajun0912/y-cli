const inquirer = require('inquirer');
const { exitProcess } = require('../../../config/utils');
const { LOG_HEADER } = require('../constants')
const logs = require('../../../config/logs');
const path = require('path');
const fs = require('fs');
const cwd = process.cwd();

function getNameBaseInfo(name) {
  let mod = '';
  const targetPath = path.join(cwd, 'src');
  if (!fs.existsSync(targetPath)) {
    logs.error(`${LOG_HEADER}当前目录下无src目录，请先创建src目录`);
    exitProcess();
  }
  const dir = fs.readdirSync(targetPath);
  const busmodList = dir.filter(item => item !== 'common' && fs.statSync(path.join(targetPath, item)).isDirectory());
  const isExist = busmodList.some(busmod => {
    const busTarget = path.join(cwd, 'src', busmod, name);
    const existBool = fs.existsSync(busTarget);
    if (existBool) {
      mod = busmod;
    }
    return existBool;
  });
  return {
    isExist,
    existBusmod: mod,
    busmodList
  };
}

module.exports = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称'
    }
  ]);
  const _valid = async (val) => {
    const { isExist, existBusmod, busmodList } = getNameBaseInfo(val);
    if (isExist) {
      const exitAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: `业务模块“${existBusmod}”中已经存在${val}项目，换一个（XXX/n）`
        }
      ]);
      if (exitAnswer.name === 'n') {
        logs.warning(`${LOG_HEADER}你已终止y clone`);
        exitProcess();
      } else {
        return await _valid(exitAnswer.name);
      }
    } else {
      return {
        name: val,
        busmodList
      };
    }
  }
  return await _valid(answer.name)
}