const inquirer = require('inquirer');
const { headerText } = require('./constant');

const getVersion = async (version, identifier) => {
  const [release, alpha] = version.split('-');
  const [cMajor, cMinor, cPatch] = release.split('.');
  const alphaSuffix = alpha && alpha.split('.').pop();
  const Patch = `${cMajor}.${cMinor}.${alpha ? +cPatch : +cPatch + 1}`;
  const Minor = `${cMajor}.${+cMinor + 1}.0`;
  const Major = `${+cMajor + 1}.0.0`;
  const Prepatch = `${cMajor}.${cMinor}.${+cPatch + 1}-${identifier}.0`;
  const Preminor = `${cMajor}.${+cMinor + 1}.0-${identifier}.0`;
  const Premajor = `${+cMajor + 1}.0.0-${identifier}.0`;
  const Prerelease = `${cMajor}.${cMinor}.${cPatch}-${identifier}.${+alphaSuffix + 1
    }`;
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'version',
      message: `${headerText}选择新版本 (当前 ${version})`,
      loop: false,
      pageSize: 10,
      choices: [
        {
          name: `Patch (${Patch})`,
          value: Patch
        },
        {
          name: `Minor (${Minor})`,
          value: Minor
        },
        {
          name: `Major (${Major})`,
          value: Major
        },
        {
          name: `Prepatch (${Prepatch})`,
          value: Prepatch
        },
        {
          name: `Preminor (${Preminor})`,
          value: Preminor
        },
        {
          name: `Premajor (${Premajor})`,
          value: Premajor
        },
        {
          name: `Custom Prerelease (${alpha ? Prerelease : Prepatch
            })`,
          value: alpha ? Prerelease : Prepatch
        },
        {
          name: 'Custom Version',
          value: 'custom'
        }
      ]
    }
  ]);
  if (answer.version === 'custom') {
    const customVersion = await inquirer.prompt([
      {
        type: 'input',
        name: 'version',
        message: `${headerText}输入自定义版本`
      }
    ]);
    return customVersion.version;
  }
  return answer.version;
};

module.exports = {
  getVersion
};
