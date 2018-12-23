const moment = require('moment');

function currentDate() {
    return moment().format('YYYYMMDD');
}

function currentMonth() {
    return currentDate().substr(0, 6);
}

function currentDay() {
    return currentDate().substr(6);
}

function isTradingDay() {
    const today = moment()
    if ([0, 6].indexOf(today.day()) >= 0) {
        return false;
    }
    const nonTradingDays = fs.readFileSync(`../config/non-trading-day${today.format('YYYY')}.json`);
    if (nonTradingDays.indexOf(currentDate()) >= 0) {
        return false;
    }
    return true;
}

module.exports = {
    currentDate,
    currentMonth,
    currentDay,
    isTradingDay,
};
