// pages/collect/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      tabs:[
        {
          id:0,
          name:'商品收藏',
          isActive:true
        },
        {
          id:1,
          name:'品牌收藏',
          isActive:false
        }, 
        {
          id:2,
          name:'店铺收藏',
          isActive:false
        },
        {
          id:3,
          name:'浏览足迹',
          isActive:false
        }
      ],
      collect:[]
    },
  //切换tabs显示效果
    handletabsItemChange(e){
      const index = e.detail;
      this.changetitleByindex(index);
      //每次切换tab时需要重新请求(index=0时,type=1)
      this.getOrders(index+1);
    },  
    onShow(){
      const collect = wx.getStorageSync("collect")||[];
      this.setData({
        collect
      })
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