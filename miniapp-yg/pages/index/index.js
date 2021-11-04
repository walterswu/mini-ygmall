//Page Object
import { request } from  "../../request/index.js"
Page({
  data: {
      //轮播图数组
      swiperList:[],
      //导航数组
      cateList:[],
      //楼层数组
      floorList:[],
      query:""
  },
  //options(Object)页面开始加载就会触发
  onLoad: function(options){
    //1.发送异步请求
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //    console.log(this.data.swiperList);
    //   }
    // });
    this.getSwiperList();
    this.getCartList();
    this.getFloorList();
  },
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result =>{
      this.setData({
              swiperList:result
            })
    })
  },
  getCartList(){
    request({url:"/home/catitems"})
    .then(result =>{
      this.setData({
          cateList:result
            })
    })
  },
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result =>{
      // 对数据中缺少index的navgatior进行处理
      let data=JSON.stringify(result) 
      data=data.replace(/goods_list/g, 'goods_list/index') 
      data=JSON.parse(data)
      this.setData({
          floorList:data
            })
    })
  },
  
});