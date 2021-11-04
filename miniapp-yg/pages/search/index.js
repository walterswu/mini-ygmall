/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
import {request} from "../../request/index.js"
Page({

    /**
     * 页面的初始数据
     */
    data: {
      goods:[],
      isFocus:false,
      inpValue:""
    },
    TimeId:-1,
    //输入框值改变就会触发
    handleInput(e){

      //先清除防抖
      clearTimeout(this.TimeId);
      // 存放在detail.value中
      // console.log(e.detail.value);
        //1.获取输入的值
        const value = e.detail.value;
        //2.检测合法性(去除两边空格)
        if(!value.trim()){
          this.setData({
            isFocus:false,
            goods:[]
          })
          return;
        }
        this.setData({
          isFocus:true
        })
        
        //1秒后再发送数据请求
        this.TimeId = setTimeout(()=>{
          this.qsearch(value);
        },1000)
          
        
    },
    //发送请求获取搜索建议 数据
    async qsearch(query){
      const res = await request({url:"/goods/qsearch",data:{query}});
      // console.log(res);
      this.setData({
        goods:res
      })
    },
    //点击取消按钮
    handleCancel(){
      this.setData({
        inpValue:"",
        isFocus:false,
        goods:[]
      })
      //清除防抖
      clearTimeout(this.TimeId);
    }
})