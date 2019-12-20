"use strict";
var path = require("path");
module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1534304805936_5738";

  // config.uploadDir = "app/public/admin/upload";
  var abcpath = path.join(__dirname, "../");
  var upload_dir = path.join(abcpath, "app/public/admin/upload");
  config.uploadDir = upload_dir;
  // config.Res_Dir = "/upload";
  config.Nginx_Host = "http://118.190.105.235:8080";
  //设置绝对路径
  // config.uploadDir = "../upload";
  // config.uploadDir = path.resolve(process.cwd(), "../upload");

  config.session = {
    key: "SESSION_ID",
    maxAge: 864000 * 1000, //一天
    // maxAge: 3600000/600, //一天
    // maxAge: 6000, //一天
    httpOnly: true,
    encrypt: true,
    renew: true //  延长会话有效期
  };

  // add your config here
  config.middleware = ["adminauth"];

  config.adminauth = {
    match: "/admin"
  };

  //多模板引擎配置
  config.view = {
    mapping: {
      ".html": "ejs",
      ".nj": "nunjucks"
    }
  };

  // config.multipart= {
  //   whitelist: [ '.png' ], // 覆盖整个白名单，只允许上传 '.png' 格式
  // }

  //配置mongose连接mongodb数据库

  exports.mongoose = {
    client: {
      // url: 'mongodb://127.0.0.1/hzfds',
      url: "mongodb://admin:qwerty123@118.190.105.235:27017/hzfds",
      options: {}
    }
  };

  exports.redis = {
    client: {
      port: 6379,
      host: "118.190.105.235",
      // host: "0.0.0.0",
      password: "qwerty123",
      db: 0
    }
  };

  exports.multipart = {
    fields: "50"
  };

  exports.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      ignore: ctx => {
        if (
          ctx.request.url == "/admin/goods/goodsUploadImage" ||
          ctx.request.url == "/admin/goods/goodsUploadPhoto" ||
          ctx.request.url == "/pass/doLogin" ||
          ctx.request.url == "/user/addAddress" ||
          ctx.request.url == "/user/editAddress"
        ) {
          return true;
        }
        return false;
      }
    }
  };

  //定义缩略图的尺寸
  exports.jimpSize = [{
      width: 180,
      height: 180
    },
    {
      width: 400,
      height: 400
    }
  ];

  //导航参数配置
  config.page = 8;

  config.REDIS_EX = 600 * 60;

  exports.OSSAliyun = {
    region: 'oss-cn-shenzhen',
    accessKeyId: 'LTAI4FfXUoEtBZ1BaqkUny6e',
    accessKeySecret: '3TOj9IxJNwMdFm296oJL5N5meE58P3',
    bucket: 'hzfds'
  }

  //支付宝支付的配置
  exports.alipayOptions = {
    app_id: "2018122062672017",
    appPrivKeyFile: "MIIEowIBAAKCAQEAytRAWUJE+t7Xg62PFPpwCxaIBwO942bZX2ehlHbdLSs0i1H3xHlIGTF/0pAYksLuXq8ovyGW263MqvAjt5n97JPjD1ip9eFuIZhZ2wbrOac+MerE+x7agDOBgmJGwdffxbGRRkjz/OtwrIfIVf7TcAm/MPSAuD3RAIkvVXzQO16x6BnBnev1JR+HybeyUssMCk1y6JZ2pZ4H62gGKGvDQcV8NW0q7g4qu2CwQKMVhbnMpG/wRuIla/MOB9MPZiV4CINsxNGya5mmzkXTemjheRl9me6dEZEgKU+tcgTH5Y36faRphbQQ9ATAt3EZQXw4gkoO9vHyEsf7mAAOofQyVQIDAQABAoIBAG+PpUEzKRvPnDyqJuwD/8KphvJMxZIhjOhj6MTvSCJDBGipEh24E8b/qe3YIhv/KftcXo4aXI7CHrPa19px0e/hO9/CBeHfN6M02B+Xw6P3cEcmeWgihU5EhjR/96lBIqzrSRuensz7dwL+wFtEiWmzgrzbjz1HiwC/dBCSUTqFlT7+M+xx8N6w3gQbZ8bpW33XY4KB26C5G8/g6ImEMUbNez8p+24qVztszHWfDHmGJp//Z4g6dgyd2RNrNZdzCyNmlsFRYRXgKa1WbC7qi2ihPUMmYLhlD5OFwZkGbk7bPy+GTYfAK6JjHRjONtdcE06pVFPUMlr7OL96MsABt1UCgYEA8YEPuvbE0Y4i+YlHrYxJ8iJ8WceWL1mNp6QFG6cNQ06+ohPhVVjEdKSFLQIz03aRGQI+E6Kuki5JVwlUeUmqJM1LJxA7NEm9b+YNQG+Y/23FcYAbuaiJp22qpo45XNLSs6QoKcqyJkZwM/Niv07mLP907PSt6WzM4a10vVs+pu8CgYEA1wDpWdxPpUsVfggCrfel6DveLzHvtX4DWPbL9NXj2j39B6Y0+1BuHMw5WZ/GoZxC0Gi/buuspwaqws9HiGg5ttMJqz23YOKUwHkpZrIpZjyVAjDoRduKcaX3q4/NCs5CPzWoGjfcJXoxcoZuYos5/kg+tXhmsH/DA0jmTfyR2vsCgYATZ71t1npGJFenGWLLDSS78g1v4Vut/lIlkEZgzHGCYQdsWpCWnQVcIgQZc73aVgKesdFvHnlMga+e8L765/Jl9qD9SI6ZSvuPzDpwXQc8LwPYdOTFbEdzTpqRu4fcb4xCpwQbJ5BdBvfpFLtwh9Ry9SveBmMbCIUF9TwWIwjLvQKBgFcQpG5iO9J4zFREFCm0rneTvs6nzyVUyTA+iKs17lYTYiK12KComl6JCPRVMk+BgsD4mgTl5P2iQoYvAA2p/y0c2r6AeIEAYDJtHinbHc6r27+OZJDdbXvGNLxBuEuW6NbF+LPdSQXYLKvu6kZ3kN17DgHYpuT0Z9ktrS2JiNr/AoGBAMBMG/25ioZMVuMFL2D1NqW221NLGMnHtFSATT1o6XGNEd5/PABCei7l2KSSrv93wyXllnk6cVauSn32zmKNWC0i6Ei89wYIUlgF7grRxBWHm0H8hgbss4YHqEf19t8Fu9QW0g48VXWsZaDmoNQotxytWx3rJ5jIuvz8xWz+UkbH",
    alipayPubKeyFile: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhb/KlxYfhRE8KRp92MQM8ZB8NVjoM9LYFOnPIuNtcMZVA8ld7ybDP2FiA+QEE7wLGqMImwl1Y4xzkrTLCjHVC8fdR8ZvzZR2I3ZOrARerI9+RbkCfT+7YLv55+A+WTHEyiB+v7PfXVTT28s0CHNLPXMyQD1u8UVEQEpbMSs8hH3pJF55Li7kc5VvJpV3RVO9TXZTVAA5mSp9FvO3u+47IJDgFVLnqqHh6ETL1nHVpxiAY2LGer+RWpVYD8v+We+VWsrfJP7bO0xr2pwizldepo8YNYPgcIAIwd7KiveypL1pA0xWgSjUHzrkVh1j/nSnvJgKSdydU/VRcaVt/Mt8wwIDAQAB"
  };

  exports.alipayBasicParams = {
    return_url: "http://127.0.0.1:7001/alipay/alipayReturn", //支付成功返回地址
    notify_url: "http://127.0.0.1:7001/alipay/alipayNotify" //支付成功异步通知地址
    // return_url: "http://0.0.0.0:7001/alipay/alipayReturn", //支付成功返回地址
    // notify_url: "http://0.0.0.0:7001/alipay/alipayNotify" //支付成功异步通知地址
  };

  return config;
};