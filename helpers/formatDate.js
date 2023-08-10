const moment = require('moment');

const createTimestamp = async (dateStr) => {
    return moment.utc(dateStr).toISOString();
};

module.exports = createTimestamp;