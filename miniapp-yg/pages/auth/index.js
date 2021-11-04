import {request} from "../../request/index.js"
import {login} from "../../utils/asyncWx.js"

Page({
  //获取用户信息
  async handleGetUserInfo(e){
    try {
      console.log(e);
    //1.获取用户信息
    const {encryptedData,rawData,iv,signature} = e.detail;
    //2.获取小程序登录成功后的code 
    const {code} =await login();
    // console.log(code);
    const loginParams ={encryptedData,rawData,iv,signature,code};
    //3.发送请求获取用户token
    let token = await request({url:'/users/wxlogin',data:loginParams,method:"post"});
    //因为没有企业账号。所以无法获取token，显示为null
     // console.log(token);
    //在这里重新赋一个字符串
    if (token==null){
      //token是null,为了教程学习能继续,暂时使用教程评论中提供的token的代码,
      token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo';
      //经测试,上述token值可用.能最终取到订单号
  }
    wx.setStorageSync("token", token)
    wx.navigateBack({
      //返回第几层
      delta: 1
    });
      
    } catch (error) {
      console.log(error);
    }
      
  }
})