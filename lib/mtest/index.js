const { getCurrentBranch, hasUnmergedChanges, hasStagedChanges, exitProcess } = require('../../config/utils')
const { execSync } = require('child_process');
const { info, success, error } = require('../../config/logs')

const LOG_HEADER = '【y mtest通知】'

function runCommand(command) {
  try {
    info(LOG_HEADER + `执行${command} ...`)
    execSync(command, { stdio: 'inherit' });
  } catch (e) {
    error(LOG_HEADER + `执行${command}失败，${e}，请手动执行剩余步骤`)
    exitProcess();
  }
}

const TEST_BRANCH = 'test'

function mtest (message) {
  info(LOG_HEADER + `开始执行 y mtest "${message}" ...`)

  const selfBranch = getCurrentBranch()
  if (!selfBranch) exitProcess();
  if (selfBranch === TEST_BRANCH) {
    error(LOG_HEADER + `当前分支为 ${TEST_BRANCH}，终止进程`)
    exitProcess();
  }
  
  runCommand('git add .');
  if (!hasStagedChanges()) {
    error(LOG_HEADER + `暂存区无改动，终止进程`)
    exitProcess();
  }
  runCommand(`git commit -m "${message}"`);
  runCommand('git push');
  runCommand(`git checkout ${TEST_BRANCH}`);
  runCommand('git pull');
  try {
    runCommand(`git merge ${selfBranch} --no-edit`);
    if (!hasUnmergedChanges()) {
      execSync('echo ":wq" | EDITOR="nvim"', { stdio: 'pipe' });
    } else {
      error(LOG_HEADER + `存在未解决的冲突，请手动解决后继续操作`)
      exitProcess();
    }
  } catch (error) {
    error(LOG_HEADER + `执行git merge ${selfBranch} 失败，具体报错 ${error}`)
    exitProcess();
  }
  runCommand('git push');
  success(LOG_HEADER + `执行 y mtest "${message}" 成功`)
}

module.exports = mtest;