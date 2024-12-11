#!/usr/bin/env node
const { hasBranch } = require('../../config/git')
const { info, success, error } = require('../../config/logs')
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function _openVsCode (spaceName) {
  info(`正在为你打开VSCode窗口...`)
  execSync(`code -n ../${spaceName}`)
  success('成功打开VSCode窗口')
}

function _getSpaceName (branch) {
  return `${path.basename(process.cwd())}_${branch.replace(/\//g, '_')}`;
}

function _addWorkTree (branch, spaceName) {
  const branchStatus = hasBranch(branch)
  info(`正在新建工作区 ${spaceName} ...`)
  switch (branchStatus) {
    case 'remote':
      execSync(`git worktree add ../${spaceName} origin/${branch}`)
      success(`工作区 ${spaceName} 新建成功，当前分支 ${branch}`)
      break;
    case 'local':
      execSync(`git worktree add ../${spaceName} ${branch}`)
      success(`工作区 ${spaceName} 新建成功，当前分支 ${branch}`)
      break;
    case 'none':
      execSync(`git worktree add -b ${branch} ../${spaceName} master`)
      success(`工作区 ${spaceName} 新建成功，当前分支 ${branch}（新建）`)
      break;
  }
}

function _installDependencies (spacePath, curSpaceName) {
  info('正在为你安装依赖...')
  execSync(`cd ${spacePath} && npm install`)
  success('依赖安装完成')
  execSync(`cd ${path.join(process.cwd(), `../${curSpaceName}`)}`)
}

function _copyLocalEnvFile (sourcePath, targetPath) {
  const localEnvFilePath = path.join(sourcePath, 'local.env.js');
  const destinationEnvFilePath = path.join(targetPath, 'local.env.js');

  // 来源文件没有或者目标文件已有，就不复制
  if (!fs.existsSync(localEnvFilePath) || fs.existsSync(destinationEnvFilePath)) return;

  fs.copyFileSync(localEnvFilePath, destinationEnvFilePath);
  success('local.env.js复制完成');
}

function add (branch) {
  const spaceName = _getSpaceName(branch)
  const spacePath = path.join(process.cwd(), `../${spaceName}`)
  const curSpaceName = path.basename(process.cwd())
  info(`check工作区 ${spaceName} 是否存在 ...`)
  if (fs.existsSync(spacePath)) {
    error(`工作区 ${spaceName} 已存在！`)
  } else {
    _addWorkTree(branch, spaceName)
  }
  _copyLocalEnvFile(process.cwd(), spacePath)
  if (!fs.existsSync(path.join(spacePath, 'node_modules'))) {
    _installDependencies(spacePath, curSpaceName)
  }
  _openVsCode(spaceName)
}

module.exports = add;