// promise形式
//三个函数主要对权限问题进行promis编写，现在已经解决
export const getSetting=()=>{
  return new Promise((resolve,reject) => {
    wx.getSetting({
      success: (result)=>{
        resolve(result);
      },
      fail: (err)=>{
        reject(err);
      },
      complete: ()=>{}
    });
  })
}
export const chooseAddress=()=>{
  return new Promise((resolve,reject) => {
    wx.chooseAddress({
      success: (result)=>{
        resolve(result);
      },
      fail: (err)=>{
        reject(err);
      },
      complete: ()=>{}
    });
  })
}
export const openSetting=()=>{
  return new Promise((resolve,reject) => {
    wx.openSetting({
      success: (result)=>{
        resolve(result);
      },
      fail: (err)=>{
        reject(err);
      },
      complete: ()=>{}
    });
  })
}





//promise形式的showModal
export const showModal=({content})=>{
  return new Promise((resolve,reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}

//promise形式的showToast
export const showToast=({title})=>{
  return new Promise((resolve,reject) => {
    wx.showToast({
      title: title,
      icon:'none',
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}
//promise形式的login
export const login=()=>{
  return new Promise((resolve,reject) => {
    wx.login({
      timeout:10000,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
       reject(err)
      }
    });
  })
}

//promise形式的requestPayment(调起微信支付)
export const requestPayment=(pay)=>{
  return new Promise((resolve,reject) => {
   wx.requestPayment({
    ...pay,
     success: (result)=>{
       resolve(result)
     },
     fail: (err)=>{
       reject(err)
     },
     complete: ()=>{}
   });
  
  })
}