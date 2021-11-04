/* 
1 点击 “+” 触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径  数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示 自定义组件
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取 data中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击 “提交”
  1 获取文本域的内容 类似 输入框的获取
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 事件触发的时候 把输入框的值 存入到变量中 
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组 
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径 一起提交到服务器 前端的模拟 不会发送请求到后台。。。 
  5 清空当前页面
  6 返回上一页 
 */
Page({

    /**
     * 页面的初始数据
     */
    data: {

      tabs:[
        {
          id:0,
          name:'体验问题',
          isActive:true
        },
        {
          id:1,
          name:'商品、商家投诉',
          isActive:false
        }, 
      ],
      //被选中的图片路径数组
      chooseImgs:[],
      //文本域的内容
      textVal:""
    },
    //外网的图片的路径数组
    UpLoadImgs:[],
    //点击切换tab
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
    //+号上传图片功能
    handleChooseImg(){
      wx.chooseImage({
        count: 9,
        sizeType: ['original','compressed'],
        sourceType: ['album','camera'],
        success: (result)=>{
          // console.log(result);
          this.setData({
            chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
          })

        },
        
      });
    },
    //删除图片
    handleRemoveImg(e){
      const index = e.currentTarget.dataset.index;
      // console.log(index);
      let chooseImgs=this.data.chooseImgs;
      chooseImgs.splice(index,1);
      this.setData({
        chooseImgs
      })
    },
    //文本域的输入事件你
    handleTextInput(e){
      this.setData({
        textVal:e.detail.value
      })
    },
    //提交按钮的点击
    handleFormSubmit(){
      const {textVal,chooseImgs} = this.data;
      if(!textVal.trim()){
        wx.showToast({
          title: '输入不合法',
          icon: 'none',
          mask: true,
        });
        return;
      }
      // 每次只能传一张,所以需要遍历上传
      wx.showLoading({
        title: "正在上传中",
        mask: true
        
      });
      if(chooseImgs.length!= 0){
        chooseImgs.forEach((v,i) => {
          wx.uploadFile({
            //上传的路径
            url: 'http://img.coolcr.cn/api/upload',
            filePath:v ,
            name: "image",
            formData: {},
            success: (result)=>{
              // console.log(result);
              let url =JSON.parse(result.data).url;
              this.UpLoadImgs.push(url);
              console.log(this.UpLoadImgs);
              // 传输完毕
              if(i==chooseImgs.length-1){
                wx.hideLoading();
                console.log("发送到后台");
                this.setData({
                  textVal:"",
                  chooseImgs:[]
                })
                wx.navigateBack({
                  delta: 1
                });
              }
            },
           
          });
        })
      }else{
        wx.hideLoading();
         console.log("文本");
         wx.navigateBack({
          delta: 1
        });
      }
      
  
    }
})