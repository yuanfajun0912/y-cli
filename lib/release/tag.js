const shell = require('shelljs');
const inquirer = require('inquirer'); // 命令行交互模块
const logs = require('../../config/logs');
const { headerText } = require('./constant');

module.exports = async function sendTagNote(version, owner, repo) {
  const resArr = await chooseTagTypeConfirm();
  const resetArr = reRiorganizzazioneArr(resArr);
  const commitMessage = manageMessages(resetArr);
  const commitMessageStr = commitMessage.replace(/\n/g, '\\n');
  const sendRelease = `curl -L \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer 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" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/${owner}/${repo}/releases" \
    -d '{"tag_name":"v${version}","name":"v${version}","body":"${commitMessageStr}"}'`
  const userStdoutRes = await shell.exec(sendRelease);
  if (userStdoutRes.code !== 0) {
    logs.error(`\n${headerText}发布tag（release）信息失败`);
    return false;
  }
  logs.success(`\n${headerText}发布tag（release）信息成功`);
  return commitMessage;
};

const reRiorganizzazioneArr = (arr) => {
  return arr.reduce((grouped, item) => {
    const key = item.answer.type;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(`- ${item.customVersion.commitMessage}`);
    return grouped;
  }, {});
};

const chooseTagTypeConfirm = async (arr) => {
  const resObj = await chooseTagType();
  const confirmAnswer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: '继续输入?',
      default: true // 可以设置默认值
    }
  ]);
  // 继续选择
  if (confirmAnswer.continue) {
    return chooseTagTypeConfirm(arr ? [...arr, resObj] : [resObj]);
    // 跳出输入
  } else {
    return arr ? [...arr, resObj] : [resObj];
  }
};

const manageMessages = (obj) => {
  let strs = '';
  Object.entries(obj).forEach(([type, valueArr]) => {
    strs += '\n' + type + '\n' + valueArr.join('\n') + '\n';
  });
  return strs;
};

const chooseTagType = async () => {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: '\n选择一个发布的类型：',
      loop: false,
      pageSize: 10,
      choices: [
        {
          name: '🐛 Bug Fixes',
          value: '🐛 **Bug Fixes**'
        },
        {
          name: '🎉 Features',
          value: '🎉 **Features**'
        },
        {
          name: '💥 Improvements',
          value: '💥 **Improvements**'
        },
        {
          name: '🚀 Optimize',
          value: '🚀 **Optimize**'
        },
        {
          name: '⚡ Improve Performance',
          value: '⚡ **Improve Performance**'
        },
        {
          name: '🔨 Refactoring Code',
          value: '🔨 **Refactoring Code**'
        },
        {
          name: '💄 Styles',
          value: '💄 **Styles**'
        },
        {
          name: '📝 Docs',
          value: '📝 **Docs**'
        },
        {
          name: '✅ Test',
          value: '✅ **Test**'
        },
        {
          name: '👷 CI',
          value: '👷 **CI**'
        }
      ]
    }
  ]);
  const customVersion = await inquirer.prompt([
    {
      type: 'input',
      name: 'commitMessage',
      message: '请输入版本发布信息'
    }
  ]);

  return {
    answer,
    customVersion
  };
};