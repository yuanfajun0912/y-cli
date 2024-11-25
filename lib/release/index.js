#!/usr/bin/env node
const shell = require('shelljs');
const { getVersion } = require('./utils');
const root = process.cwd();
const { version: versionRoot } = require(root + '/package.json');
const identifier = 'alpha';
const standard = require('./standard');
const sendTagNote = require('./tag')

const main = async (owner, repo) => {
  const version = await getVersion(versionRoot, identifier);
  const isRelease = !version.includes(identifier);
  // alpha 跳过changelog tag commit 正式版本跳过commit changelog
  const skipArgs = ['changelog', 'commit', 'tag'];
  isRelease && skipArgs.pop();
  await standard(version, skipArgs);

  await shell.exec('git add -A');
  await shell.exec(`git commit -m "chore(release): ${version}"`);
  await shell.exec('git push');
  if (isRelease) {
    await shell.exec(`git push origin v${version}`);
    sendTagNote(version, owner, repo)
  }
};

module.exports = main;
