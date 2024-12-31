#!/usr/bin/env node

const { execSync } = require('child_process');
const spinner = require('../../config/spinner')
const { exitProcess } = require('../../config/utils')
const { getCurrentBranch, hasBranch, getLogInfo, getDiffInfo } = require('../../config/git')
const { info, error, success } = require('../../config/logs')
const inquirer = require('inquirer');

const exec = (command) => execSync(command, { stdio: 'inherit' })

const MASTER_BRANCH = 'master'

async function mmaster (message, weeks = 2) {
  info(`开始执行 y mmaster "${message}" ...`)
  const selfBranch = getCurrentBranch()
  if (!selfBranch) exitProcess();
  if (selfBranch === MASTER_BRANCH) {
    error(`当前分支为 ${MASTER_BRANCH}，终止进程`)
    exitProcess();
  }
  const bakBranch = createBackupBranch(selfBranch)
  await mergeCommits(message, weeks)
  compareDiff(selfBranch, bakBranch)
  exec('git push -f')
  success(`执行 y mmaster "${message}" 成功，去新建merge request吧~`)
}

function createBackupBranch (branchName) {
  const execSpinner = spinner(`创建 ${branchName} 的备份分支`)
  try {
    const TAG = '_bak'
    // 避免备份分支冲突
    let temp = 0
    do {
      bakBranch = temp > 0 ? `${branchName}${TAG}${temp}` : `${branchName}${TAG}`
      temp++
    } while (hasBranch(bakBranch) !== 'none')
    exec(`git checkout -b ${bakBranch}`)
    exec(`git checkout ${branchName}`)
    execSpinner.succeed(`备份分支 ${bakBranch}`)
    return bakBranch
  } catch (e) {
    execSpinner.fail(`创建 ${branchName} 的备份分支失败，报错信息 ${e}`)
    exitProcess();
  }
}

async function mergeCommits (message, weeks) {
  const choices = getLogInfo(weeks).split('\n')
  const { command } = await inquirer.prompt([
    {
      type: "list",
      name: "command",
      message: "请选择你的第一个commit的前一个commit",
      pageSize: 20,
      choices,
    },
  ]);
  const id = command.match(/^[a-f0-9]{7}/)?.[0]
  if (!id) {
    error(`请选择正确的commit`)
    exitProcess();
  }
  exec(`git reset --mixed ${id}`)
  exec(`git add .`)
  exec(`git commit -m "${message}"`)
}

function compareDiff (selfBranch, bakBranch) {
  const diffSpinner = spinner(`check分支${selfBranch}和分支${bakBranch}的改动差异`)
  const diffRes = getDiffInfo(selfBranch, 'origin/master') === getDiffInfo(bakBranch, 'origin/master')
  if (diffRes) {
    diffSpinner.succeed(`分支${selfBranch}和分支${bakBranch}的改动一致`)
  } else {
    diffSpinner.fail(`分支${selfBranch}和分支${bakBranch}的改动不一致`)
    exitProcess();
  }
}

module.exports = mmaster