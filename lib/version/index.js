const packageJson = require('../../package.json')

const version = () => {
  console.log(packageJson.version)
}

module.exports = version