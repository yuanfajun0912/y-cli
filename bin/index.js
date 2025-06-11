#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();

program
  .option('-v, -V, --version')
  .description('输出版本号')
  .action(() => {
    require('../lib/version')()
  });

program
  .command('mtest')
  .description('在个人分支上将改动merge进test分支')
  .argument('<message>', 'commit的提交信息')
  .action((message) => {
    require('../lib/mtest')(message)
  });

program
  .command('mmaster')
  .description('生成merge master的链接')
  .argument('<message>', '最终合并的commit提交信息')
  .argument('[weeks]', '查询前weeks周的git记录')
  .action((message) => {
    require('../lib/mmaster')(message)
  });

program
  .command('p')
  .description('add、commit、push的快捷操作')
  .argument('<message>', 'commit的提交信息')
  .action((message) => {
    require('../lib/p')(message)
  });

program
  .command('release')
  .description('更新版本号信息')
  .action(() => {
    require('../lib/release')()
  });

program
  .command('clone')
  .description('下载代码模版')
  .action((type) => {
    require('../lib/clone')(type)
  });

// 添加新命令
program
  .command('wi')
  .description('根据设备类型将图片转换为合适尺寸的高质量PNG格式')
  .argument('<path>', '需要处理的图片路径')
  .action((path) => {
    require('../lib/wi')(path)
  });


// space相关 start
const spaceCommand = program.command('space')
  .description('管理工作区');

spaceCommand
  .command('add')
  .description('添加工作区')
  .argument('<branch>', '新工作区使用的分支')
  .action((branch) => {
    require('../lib/space/add')(branch)
  });

spaceCommand
  .command('list')
  .description('查看工作区列表')
  .action(() => {
    require('../lib/space/list')()
  });

spaceCommand
  .command('remove')
  .description('删除工作区')
  .argument('<branch>', '创建该工作区时使用的分支')
  .action((branch) => {
    require('../lib/space/remove')(branch)
  });
// space相关 end

program.parse(process.argv);