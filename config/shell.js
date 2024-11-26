const shell = require('shelljs');

// 默认会在node_modules目录执行，不影响工作目录
function shellExec(command, noModules) {
  const modulesStr = noModules ? '' : 'cd node_modules;';
  return new Promise((resolve, reject) => {
    shell.exec(
      `
    ${modulesStr}
    ${command}
    `,
      function (code, stdout, stderr) {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(stderr);
        }
      }
    );
  });
}

async function shellExecArr(commandArr) {
  const res = [];
  for (let i = 0; i < commandArr.length; i++) {
    res.push(await shellExec(commandArr[0]));
  }
  return res;
}

module.exports = {
  shellExec,
  shellExecArr
};
