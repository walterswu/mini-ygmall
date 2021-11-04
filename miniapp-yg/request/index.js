//设置一个页面请求的次数
let ajaxTime = 0;
export const request=(params)=>{
  //判断地址中是否有/my，有就是支付相关，自动加入请求头header
  let header = {...params.header};
  if(params.url.includes("/my/")){
    //拼接header(token)
    header["Authorization"]=wx.getStorageSync("token");
  }
  ajaxTime++;
  // 显示加载中效果
  wx.showLoading({
    title:'加载中' ,
    mask:true
  });
    




  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve,reject) => {
    wx.request({
      ...params,
      header:header,
      // 解构并添加到路径中
      url:baseUrl+params.url,
      success:(result)=>{
        resolve(result.data.message);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTime--;
        //关闭正在等待图标
        if(ajaxTime==0){
          wx.hideLoading();
        }
        
      }
    });
  })
}