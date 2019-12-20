var sd = require("silly-datetime");
var path=require('path');

module.exports = {
  //parmas  时间戳          13位的时间戳
  formatTime(parmas) {
    return sd.format(new Date(parmas), "YYYY-MM-DD HH:mm");
  },

  //数组转字符串以逗号分隔
  arrToStr(arr) {
    if (!arr || !(arr instanceof Array)) return;
    return arr.join(",");
  },
  formatImg(dir, width, height) {
    height = height || width;
    return dir + "_" + width + "x" + height + path.extname(dir);
  }
};
