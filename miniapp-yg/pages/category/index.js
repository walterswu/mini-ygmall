// pages/category/index.js
import {request} from '../../request/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      //左侧菜单数据
      leftMenuList:[],
      rightContent:[],
      // 被点击的左侧菜单
      currentIndex:0,
      scrollTop:0
    },
    //接口的返回数据
    Cates:[],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      // 接口数据量过大，需要判断有无存在，否则请求太频繁
      //web的本地存储和小程序中的本地存储的区别
      //web:localStorage.setItem("key","value") 会先调用toString(),把数据变成字符串再存入
      // web获取:localStorage.getItem("key")
      //小程序:wx.setStorageSync("key","value") 直接存入
      //小程序获取:wx.getStorageSync("key")
      const Cates=wx.getStorageSync("cates");
      // 如果不存在
      if(!Cates){
        //不存在则放请求
        this.getCates();
      }else{
        //有旧数据超过10s
        if(Date.now()-Cates.time>1000*10){
          this.getCates();
        }else{
          console.log("可以使用旧的数据");
          this.Cates = Cates.data;

          //构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(item =>item.cat_name)
        //构造右侧的商品数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
        }
      }
    },
    //获取分类方法
    async getCates(){
      // request({url:"/categories"})
      // .then(result =>{
      //   // console.log(result);
      //   this.Cates = result.data.message
      //   //把接口的数据存入到本地存储中
      //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});


      //   //构造左侧的大菜单数据
      //   let leftMenuList = this.Cates.map(item =>item.cat_name)
      //   //构造右侧的商品数据
      //   let rightContent = this.Cates[0].children
      //   this.setData({
      //     leftMenuList,
      //     rightContent
      //   })
        
      // })
      //1.使用es7的async await语法 
        const result = await request({url:"/categories"})
        this.Cates = result
        //把接口的数据存入到本地存储中
        wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});


        //构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(item =>item.cat_name)
        //构造右侧的商品数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
    },
    handleItemTap(e){
      // console.log(e);
      //1.获取被点击标题的索引
      //2.给data中的currentIndex赋值
      const index = e.currentTarget.dataset.index;
      // console.log(index);
      let rightContent = this.Cates[index].children

      this.setData({
        currentIndex:index,
        rightContent,
        scrollTop:0
      })
    }
    
})