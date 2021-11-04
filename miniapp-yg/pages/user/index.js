// pages/user/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userInfo:{},
      // 收藏的商品数量
      collectNum:0,
    },

    onShow(){
      const userInfo = wx.getStorageSync("userInfo");
      const collect = wx.getStorageSync("collect");
      this.setData({
        userInfo,
        collectNum:collect.length
      })
      console.log(userInfo);
    }

})