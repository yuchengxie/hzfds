"use strict";

module.exports = app => {
  const { router, controller } = app;
  //商城后台管理系统
  router.get("/admin", controller.admin.main.index);
  // router.get("/admin", controller.admin.main.welcome);
  router.get("/admin/login", controller.admin.login.index);
  router.post("/admin/doLogin", controller.admin.login.doLogin);
  router.get("/admin/logout", controller.admin.login.loginOut);
  router.get("/admin/welcome", controller.admin.main.welcome);
  
  //公共路由
  router.get("/admin/verify", controller.admin.base.verify);
  router.get("/admin/delete", controller.admin.base.delete);
  router.get("/admin/changeStatus", controller.admin.base.changeStatus);
  router.get("/admin/editNum", controller.admin.base.editNum);

  //管理员管理
  router.get("/admin/manager", controller.admin.manager.index);
  router.get("/admin/manager/add", controller.admin.manager.add);
  router.post("/admin/manager/doAdd", controller.admin.manager.doAdd);
  router.get("/admin/manager/edit", controller.admin.manager.edit);
  router.post("/admin/manager/doEdit", controller.admin.manager.doEdit);

  //角色管理
  router.get("/admin/role", controller.admin.role.index);
  router.get("/admin/role/add", controller.admin.role.add);
  router.post("/admin/role/doAdd", controller.admin.role.doAdd);
  router.post("/admin/role/doEdit", controller.admin.role.doEdit);
  router.get("/admin/role/edit", controller.admin.role.edit);
  router.get("/admin/role/auth", controller.admin.role.auth);
  router.post("/admin/role/doAuth", controller.admin.role.doAuth);
  router.get("/admin/access", controller.admin.access.index);
  router.get("/admin/access/add", controller.admin.access.add);
  router.post("/admin/access/doAdd", controller.admin.access.doAdd);
  router.post("/admin/access/doEdit", controller.admin.access.doEdit);
  router.get("/admin/access/edit", controller.admin.access.edit);

  //上传图片
  router.get("/admin/focus", controller.admin.focus.index);
  router.get("/admin/focus/add", controller.admin.focus.add);
  router.get("/admin/focus/edit", controller.admin.focus.edit);
  router.post("/admin/focus/doEdit", controller.admin.focus.doEdit);
  router.post("/admin/focus/doAdd", controller.admin.focus.doAdd);

  //商品类型
  router.get("/admin/goodsType", controller.admin.goodsType.index);
  router.get("/admin/goodsType/add", controller.admin.goodsType.add);
  router.get("/admin/goodsType/edit", controller.admin.goodsType.edit);
  router.post("/admin/goodsType/doEdit", controller.admin.goodsType.doEdit);
  router.post("/admin/goodsType/doAdd", controller.admin.goodsType.doAdd);

  //商品属性
  router.get(
    "/admin/goodsTypeAttribute",
    controller.admin.goodsTypeAttribute.index
  );
  router.get(
    "/admin/goodsTypeAttribute/add",
    controller.admin.goodsTypeAttribute.add
  );
  router.get(
    "/admin/goodsTypeAttribute/edit",
    controller.admin.goodsTypeAttribute.edit
  );
  router.post(
    "/admin/goodsTypeAttribute/doAdd",
    controller.admin.goodsTypeAttribute.doAdd
  );
  router.post(
    "/admin/goodsTypeAttribute/doEdit",
    controller.admin.goodsTypeAttribute.doEdit
  );

  //商品分类
  router.get("/admin/goodsCate", controller.admin.goodsCate.index);
  router.get("/admin/goodsCate/add", controller.admin.goodsCate.add);
  router.get("/admin/goodsCate/edit", controller.admin.goodsCate.edit);
  router.post("/admin/goodsCate/doAdd", controller.admin.goodsCate.doAdd);
  router.post("/admin/goodsCate/doEdit", controller.admin.goodsCate.doEdit);

  //商品模块
  router.get("/admin/goods", controller.admin.goods.index);
  router.get("/admin/goods/add", controller.admin.goods.add);
  router.get("/admin/goods/edit", controller.admin.goods.edit);
  router.get(
    "/admin/goods/goodsTypeAttribute",
    controller.admin.goods.goodsTypeAttribute
  );
  router.post("/admin/goods/doAdd", controller.admin.goods.doAdd);
  router.post("/admin/goods/doEdit", controller.admin.goods.doEdit);
  router.post(
    "/admin/goods/changeGoodsImageColor",
    controller.admin.goods.changeGoodsImageColor
  );
  router.post(
    "/admin/goods/goodsImageRemove",
    controller.admin.goods.goodsImageRemove
  );
  router.post(
    "/admin/goods/goodsUploadImage",
    controller.admin.goods.goodsUploadImage
  );
  router.post(
    "/admin/goods/goodsUploadPhoto",
    controller.admin.goods.goodsUploadPhoto
  );

  //导航模块
  router.get("/admin/nav", controller.admin.nav.index);
  router.get("/admin/nav/add", controller.admin.nav.add);
  router.get("/admin/nav/edit", controller.admin.nav.edit);
  router.post("/admin/nav/doEdit", controller.admin.nav.doEdit);
  router.post("/admin/nav/doAdd", controller.admin.nav.doAdd);

  //文章分类模块
  router.get("/admin/articleCate", controller.admin.articleCate.index);
  router.get("/admin/articleCate/add", controller.admin.articleCate.add);
  router.get("/admin/articleCate/edit", controller.admin.articleCate.edit);
  router.post("/admin/articleCate/doEdit", controller.admin.articleCate.doEdit);
  router.post("/admin/articleCate/doAdd", controller.admin.articleCate.doAdd);

  //文章模块
  router.get("/admin/article", controller.admin.article.index);
  router.get("/admin/article/add", controller.admin.article.add);
  router.get("/admin/article/edit", controller.admin.article.edit);
  router.post("/admin/article/doEdit", controller.admin.article.doEdit);
  router.post("/admin/article/doAdd", controller.admin.article.doAdd);

  //系统设置
  router.get("/admin/setting", controller.admin.setting.index);
  router.post("/admin/setting/doEdit", controller.admin.setting.doEdit);
};
