const getName = require('./getName');
const getModule = require('./getModule');
const { shellExec } = require('../../../config/shell');
const { LOG_HEADER } = require('../constants');
const logs = require('../../../config/logs');
const { exitProcess } = require('../../../config/utils');
const fs = require('fs');

const main = async () => {
  const { name, busmodList } = await getName()
  const module = await getModule(busmodList)
  logs.info(`${LOG_HEADER}clone...`)
  downloadrepo(async () => {
    await shellExec(`
      cd static;
      git checkout template;
      cd ../..;
      rm -rf .temp;
      cp -R node_modules/static/wb/project-template/. src/${module}/${name};
      rm -rf node_modules/static;
    `);
    logs.success(`${LOG_HEADER}clone完成`)
  })
}



function downloadrepo(cb) {
  // 下载模版
  if (!fs.existsSync('node_modules/static')) {
    shellExec('git clone git@github.com:yuanfajun0912/static.git;')
      .then(() => {
        cb && cb();
      })
      .catch((e) => {
        logs.error(LOG_HEADER, e);
        exitProcess()
      });
  } else {
    cb && cb();
  }
}

module.exports = main;