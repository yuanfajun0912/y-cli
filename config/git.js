const { execSync } = require('child_process');
const { error } = require('./logs')

// 获取当前分支
function getCurrentBranch() {
  try {
    const branchOutput = execSync('git rev-parse --abbrev-ref HEAD', { stdio: 'pipe' }).toString().trim();
    return branchOutput;
  } catch (e) {
    error('获取当前分支失败' + e);
    return null
  }
}

// 工作区是否有改动
function hasChanges() {
  try {
    const changes = execSync('git diff --quiet --exit-code').toString().trim();
    return changes !== '';
  } catch (error) {
    return true;
  }
}

// 暂存区是否有改动
function hasStagedChanges() {
  try {
    const diffOutput = execSync('git diff --cached', { stdio: 'pipe' }).toString().trim();
    return diffOutput !== '';
  } catch (error) {
    return false; // 如果执行命令失败，默认认为没有改动
  }
}

// 是否有未解决的冲突
function hasUnmergedChanges() {
  try {
    const unmergedFiles = execSync('git diff --name-only', { stdio: 'pipe' }).toString().trim();
    return unmergedFiles !== '';
  } catch (error) {
    return true;
  }
}

// 仓库是否存在该分支
function hasBranch(branchName) {
  try {
    const remoteBranches = execSync(`git ls-remote --heads origin ${branchName}`, { stdio: 'pipe' })
      .toString()
      .trim();
    if (remoteBranches !== '') return 'remote'
    const localBranches = execSync('git branch --list ' + branchName, { stdio: 'pipe' })
      .toString()
      .trim();
    return localBranches !== '' ? 'local' : 'none';
  } catch (e) {
    error(`检查是否存在该分支 ${branchName} 失败: ` + e);
    return 'none';
  }
}

// 获取log信息--单行
function getLogInfo(sinceWeeks = 2) {
  try {
    const logOutput = execSync(`git log --since=${sinceWeeks}.weeks --oneline`, { stdio: 'pipe' }).toString().trim();
    return logOutput;
  } catch (e) {
    error(`获取log信息 ${branchName} 失败: ` + e);
    return null;
  }
}

// 获取diff信息
function getDiffInfo (sourceBranch, targetBranch) {
  try {
    const info = execSync(`git diff --shortstat ${sourceBranch} ${targetBranch}`, { stdio: 'pipe' }).toString().trim();
    return info;
  } catch (e) {
    error(`获取${sourceBranch}和${targetBranch}的diff信息失败: ` + e);
    return null;
  }
}

module.exports = {
  getCurrentBranch,
  hasStagedChanges,
  hasUnmergedChanges,
  hasChanges,
  hasBranch,
  getLogInfo,
  getDiffInfo
}