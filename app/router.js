"use strict";
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  //路由模块化
  require("./router/admin")(app);
  require("./router/default")(app);
};
