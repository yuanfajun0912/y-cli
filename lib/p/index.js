#!/usr/bin/env node

const { hasStagedChanges, getCurrentBranch, hasBranch } = require('../../config/git')
const { exitProcess } = require('../../config/utils')
const { execSync } = require('child_process');
const { info, success, error } = require('../../config/logs')

const LOG_HEADER = '【y p通知】'

function runCommand(command) {
  try {
    info(LOG_HEADER + `执行${command} ...`)
    execSync(command, { stdio: 'inherit' });
  } catch (e) {
    error(LOG_HEADER + `执行${command}失败，${e}，请手动执行剩余步骤`)
    exitProcess();
  }
}

function p(message) {
  info(LOG_HEADER + `开始执行 y p "${message}" ...`)
  const selfBranch = getCurrentBranch()

  runCommand('git add .');
  if (!hasStagedChanges()) {
    error(LOG_HEADER + `暂存区无改动，终止进程`)
    exitProcess();
  }
  runCommand(`git commit -m "${message}"`);
  // 没有远端分支
  if (hasBranch(selfBranch) !== 'remote') {
    runCommand(`git push --set-upstream origin ${selfBranch}`);
  } else {
    runCommand('git push');
  }
  success(LOG_HEADER + `执行 y mtest "${message}" 成功`)
}

module.exports = p;