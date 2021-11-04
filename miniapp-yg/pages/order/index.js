/* 
1 页面被打开的时候 onShow 
  0 onShow 不同于onLoad 无法在形参上接收 options参数 
  0.5 判断缓存中有没有token 
    1 没有 直接跳转到授权页面
    2 有 直接往下进行 
  1 获取url上的参数type
  2 根据type来决定页面标题的数组元素 哪个被激活选中 
  2 根据type 去发送请求获取订单数据
  3 渲染页面
2 点击不同的标题 重新发送请求来获取和渲染数据 
 */
import {request} from '../../request/index'

Page({
    /**
     * 页面的初始数据
     */
    data: {
      tabs:[
        {
          id:0,
          name:'全部',
          isActive:true
        },
        {
          id:1,
          name:'待付款',
          isActive:false
        }, 
        {
          id:2,
          name:'待发货',
          isActive:false
        },
        {
          id:3,
          name:'退款/退货',
          isActive:false
        }
      ],
      orders:{}
    },
    onShow(options){
      const token = wx.getStorageSync("token");
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      //1.获取小程序的页面栈 长度最大是10,
      let pages = getCurrentPages();
       // 索引最大的就是当前页面
       //获取当前页面的type参数
       
      const type = pages[pages.length-1].options.type;
      //设置个人中心点击跳到对应的tabs
      this.changetitleByindex(type-1);
      console.log(type);
      this.getOrders(type)
    },
    async getOrders(type){
      const res = await request({url:"/my/orders/all",data:{type}});
      const orders = res.orders;
      this.setData({
        //对orders的时间进行处理并赋值(牛)
        orders:orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
      })
      console.log(orders);
    },
    //切换tabs显示效果
    handletabsItemChange(e){
      const index = e.detail;
      this.changetitleByindex(index);
      //每次切换tab时需要重新请求(index=0时,type=1)
      this.getOrders(index+1);
    },
    //获取索引并切换
    changetitleByindex(index){
      let tabs = this.data.tabs;
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      this.setData({
        tabs
      })
    }
 
})