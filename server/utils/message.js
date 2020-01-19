var moment = require("moment");

var generateMessage = (from, text, color, backgroundcolor) => {
  return {
    from,
    text,
    createdAt: moment().valueOf(),
    color,
    backgroundcolor
  };
};

module.exports = { generateMessage };
