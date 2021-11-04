/* 
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      Math.ceil函数会向上取整,取最大的数
      总页数 = Math.ceil(总条数 /  页容量  pagesize)
      总页数     = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++ 
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果

 */
import {request} from '../../request/index'
Page({
  data:{
    tabs:[
      {
        id:0,
        name:'综合',
        isActive:true
      },
      {
        id:1,
        name:'销量',
        isActive:false
      }, 
      {
        id:2,
        name:'价格',
        isActive:false
      }
    ],
    goodsList:[]
  },
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
//获取传过来的cid
onLoad:function (options){
  this.QueryParams.cid = options.cid||"";
  this.QueryParams.query = options.query||"";

  // console.log(this.QueryParams.cid);
  this.getGoodsList(); 
},
  async getGoodsList(){
    //request默认传入一个对象
    const result = await request({url:"/goods/search",data:this.QueryParams})
    const total = result.total
    //计算总页数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
    // console.log(this.totalPages);
    this.setData({
      // goodsList:result.goods  
      // 要使用es6拼接数组对下一页的数据进行解构拼接
      //第一种
      goodsList:[...this.data.goodsList,...result.goods]
      // 第二种
      // goodsList:this.data.goodsList.concat(result.goods)

    })
    console.log(this.data.goodsList);
    // 关闭下拉刷新的等待(自带)
    wx.stopPullDownRefresh();
      
  },
  
  // tabs切换效果实现方法
  handletabsItemChange(e){
    // console.log(e.detail);
    //获取传过来的索引
    const index = e.detail;
    // 对tabs进行foreach循环
    let tabs = this.data.tabs;
    // v为循环项，i为索引
    tabs.forEach((v,i) =>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs:tabs
    })
  },
  //下拉加载下一页方法
  //自带页面触底方法
  onReachBottom(){
    // 判断当前页是否超过总页数
    if(this.QueryParams.pagenum>=this.totalPages){
      // console.log("没有数据了");
      // 显示提示框
      wx.showToast({
        title: '没有下一页数据了',
      });
    }else{
      console.log("有下一页数据");
      //传入下一页数据
    this.QueryParams.pagenum++;
    this.getGoodsList();
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    // console.log("下拉刷新了");
    //1重置数组
    this.setData({
      goodsList:[]
    })
    //2将页码变为1
    this.QueryParams.pagenum=1
    //3重新发送请求
    this.getGoodsList()
  }
})