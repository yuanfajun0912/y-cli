const inquirer = require('inquirer');

module.exports = async (list) => {
  if (list.length === 1) return list[0];
  const answer = await inquirer.prompt([
    {
      type: 'list',
      message: '请选择项目所属的业务模块',
      name: 'module',
      choices: list
    }
  ]);
  return answer.module;
}