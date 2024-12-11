#!/usr/bin/env node
const { execSync } = require('child_process');
const { error } = require('../../config/logs')

function list() {
  try {
    const output = execSync('git worktree list').toString().trim();
    const lines = output.split('\n');
    const headers = ['对应分支（使用此名称做y space remove的key）', '工作区路径', '最新commit-id'];

    // 解析每一行数据
    const data = lines.map(line => {
      const parts = line.trim().split(/\s+/);
      return {
        [headers[0]]: parts.slice(2).join(' ').replace(/\[|\]/g, ''),
        [headers[1]]: parts[0],
        [headers[2]]: parts[1],
      };
    });

    console.table(data);
  } catch (e) {
    error(`y spaceList 执行失败: ${e}`)
  }
}

module.exports = list;