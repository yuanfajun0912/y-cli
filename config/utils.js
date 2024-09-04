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

function exitProcess() {
  process.exit(1);
}

module.exports = {
  getCurrentBranch,
  hasStagedChanges,
  hasUnmergedChanges,
  hasChanges,
  exitProcess
}