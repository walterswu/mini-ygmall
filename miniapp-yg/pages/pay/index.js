/* 
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据  checked=true 
2 微信支付(有企业账号的appid才能做)
  1 哪些人 哪些帐号 可以实现微信支付
    1 企业帐号 
    2 企业帐号的小程序后台中 必须 给开发者 添加上白名单 
      1 一个 appid 可以同时绑定多个开发者
      2 这些开发者就可以公用这个appid 和 它的开发权限  
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面 进行获取token 
  3 有token 。。。
  4 创建订单 获取订单编号
  5 已经完成了微信支付
  6 手动删除缓存中 已经被选中了的商品 
  7 删除后的购物车数据 填充回缓存
  8 再跳转页面 
 */
  import {requestPayment,showToast} from "../../utils/asyncWx.js"
  import {request} from "../../request/index.js"
  Page({
  
      /**
       * 页面的初始数据
       */
      data: {
        address:{},
        //存放购物车商品
        cart:{},
        totalPrice:0,
        totalNum:0
      },
      //页面被展示时调用
      onShow(){
        let address = wx.getStorageSync("address");
        // address.all =  address.provinceName+address.cityName+address.countyName+address.detailInfo;
        //获取缓存中的购物车数据
        //const为只读的常量，不能修改,let为局部变量，可重复替代和修改
        let cart = wx.getStorageSync("cart")||[];
        console.log(cart);
        //过滤checked为true的数组(js过滤器)
        cart = cart.filter(v=>v.checked);
        let totalprice = 0;
        let totalNum = 0;
        cart.forEach(item => {
            totalNum+=item.num;
            totalprice+=item.num*item.goods_price;
        });
        this.setData({
          cart,
          totalprice,
          totalNum,
          address
        })
      },
      async handleOrderPay(){
        try {
          //1.判断缓存中有无token
        const token = wx.getStorageSync("token");
        //2.判断
        if(!token){
          wx.navigateTo({
            url: '/pages/auth/index',
          });
            return
        }
        //3.创建订单
        //3.1准备请求头
        // const header ={Authorization:token,}; 
        //3.2准备请求体参数
        const order_price =this.data.totalPrice;
        const consignee_addr = this.data.address.userName;
        const cart = this.data.cart;
        let goods=[];
        cart.forEach(item =>goods.push({
          goods_id:item.goods_id,
          goods_num:item.num,
          goods_price:item.price
        }));
        //将值合并到对象中
        const orderParams ={order_price,consignee_addr,goods}

        //4.准备发送请求 创建订单 获取订单
        const {order_number} =await request({url:"/my/orders/create",method:"POST",data:orderParams})
        //5 发起预支付接口
        const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}})
        //6.发起微信支付(出现二维码)
        await requestPayment(pay);
        //7.查询后台 订单状态
        const res = await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}})
        //出现支付成功
        console.log(res);
        await showToast({title:"支付成功"})
        //8 手动删除缓存中已经支付的商品
        let newCart = wx.getStorageSync("cart");
        newCart=newCart.filter(item => !item.checked);
        wx.setStorageSync("cart", newCart);
          
        //9.支付成功跳转到订单页面
        wx.navigateTo({
          url:'/pages/order/index'
        })
        } catch (error) {
        await showToast({title:"支付失败"})

          console.log(error);
        }
      } 



  })