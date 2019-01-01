function formatBadgeValue(seconds) {
    var divisors = seconds < 3600 ? [60, 1] : [3600, 60];

    return Math.floor(seconds / divisors[0]) + ":" + padTimer(Math.floor((seconds % divisors[0]) / divisors[1]));
}

function padTimer(val) {
    return val < 10 ? "0" + val : val;
}