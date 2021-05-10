const DEBUG_LEVELS = {
    "none": -1,
    "comment": 0,
    "low": 1,
    "med": 2,
    "high": 3
}

class dbug {

    static is_below_level(debug_level='comment', log_str='', callback) {
        let level = DEBUG_LEVELS[process.env.DEBUG_LEVEL];
        if (level >= DEBUG_LEVELS[debug_level]) {callback(log_str);}
    }
    static log(log_str) {dbug.is_below_level('comment', log_str, (str)=>{console.log(str)})}
    static low(log_str) {dbug.is_below_level('low', log_str, (str)=>{console.info(str)})}
    static med(log_str) {dbug.is_below_level('med', log_str, (str)=>{console.debug(str)})}
    static high(log_str) {dbug.is_below_level('high', log_str, (str)=>{console.warn(str)})}
}

module.exports = dbug;