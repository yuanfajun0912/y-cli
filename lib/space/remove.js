#!/usr/bin/env node
const { execSync } = require('child_process');
const { error, success } = require('../../config/logs')
const path = require('path');

function remove(branch) {
  try {
    const output = execSync('git worktree list').toString().trim();
    const pathList = output.split('\n').map(line => {
      const parts = line.trim().split(/\s+/)
      return path.basename(parts[0])
    })
    const spaceName = pathList.find(_ => _.includes(branch.replace(/\//g, '_')))
    if (spaceName) {
      execSync(`git worktree remove ../${spaceName} --force`)
      success(`工作区 ${spaceName} 删除成功`)
    } else {
      error(`工作区 ${spaceName} 不存在`)
    }
  } catch (e) {
    error(`y removeSpace 执行失败: ${e}`)
  }
}

module.exports = remove;