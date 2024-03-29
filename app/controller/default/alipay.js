'use strict';

const Controller = require('egg').Controller;

class AlipayController extends Controller {
    async pay() {
        var d=new Date();
        const data = {
            subject: '陶瓷666',
            out_trade_no: d.getTime().toString(),
            total_amount: '0.01'     
        }

        var url=await this.service.alipay.doPay(data);
        this.ctx.redirect(url);

    }


    async alipayReturn(){
        this.ctx.body='支付成功';
        //接收异步通知        
    }

    //支付成功以后更新订单   必须正式上线
    async alipayNotify(){
        const params = this.ctx.request.body; //接收 post 提交的 XML 
        console.log(params);
        var result=await this.service.alipay.alipayNotify(params);
        console.log('-------------');
        console.log(result);
        if(result.code==0){
            if(params.trade_status=='TRADE_SUCCESS'){
            //更新订单
            }
         }
        //接收异步通知
    }

}

module.exports = AlipayController;
