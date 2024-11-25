const standardVersion = require('standard-version');
const skipReducer = (accumulator, current) => {
  return {
    ...accumulator,
    [current]: true
  };
};
const standard = async (version, skipArgs) => {
  return standardVersion({
    releaseAs: version,
    skip: skipArgs.reduce(skipReducer, {})
  });
};

module.exports = standard;
