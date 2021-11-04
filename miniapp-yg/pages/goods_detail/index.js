/* 
1 发送请求获取数据 
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api  previewImage 
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式 
  3 先判断 当前的商品是否已经存在于 购物车
  4 已经存在 修改商品数据  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5 不存在于购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num  重新把购物车数组 填充回缓存中
  6 弹出提示
4 商品收藏
  1 页面onShow的时候  加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏 
    1 是 改变页面的图标
    2 不是 。。
  3 点击商品收藏按钮 
    1 判断该商品是否存在于缓存数组中
    2 已经存在 把该商品删除
    3 没有存在 把商品添加到收藏数组中 存入到缓存中即可
 */
import {request} from '../../request/index'
Page({
    /**
     * 页面的初始数据
     */
    data: {
      goodsObj:{},
      //商品是否被收藏
      isCollect:false
    },
    Goodsinfo:{},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
      let pages =  getCurrentPages();
      const currentPage = pages[pages.length-1];
      let options = currentPage.options;
      const {goods_id} = options;
      console.log(goods_id);
      this.getGoodsDetail(goods_id);
       
      
    },
    //获取该商品详情
    async getGoodsDetail(goods_id){
      const result = await request({url:"/goods/detail",data:{goods_id}})
      console.log(result);
      this.Goodsinfo=result;
      // 商品收藏
      //1.获取缓存中的商品收藏数组
      let collect = wx.getStorageSync("collect")||[];
      //只要返回一个true那么结果就是true
      let isCollect = collect.some(v=>v.goods_id===this.Goodsinfo.goods_id)
      this.setData({
        isCollect,
        goodsObj:{
          
          goods_name:result.goods_name,
          pics:result.pics,
          goods_price:result.goods_price,
                    //iphone不识别richtext中的webp格式的图片，建议改成jpg
          goods_introduce:result.goods_introduce.replace(/\.webp/g,'.jpg')
        }
      })
    },
    //点击轮播图放大预览
    handlePreviewImage(e){
      // console.log(e);
      //1.先构造要预览的图片数组
      const pic = e.currentTarget.dataset.url;
      const urls = this.Goodsinfo.pics.map(v=>v.pics_mid);
      wx.previewImage({
        current: pic,
        urls: urls,
       
      });
    },
    //往购物车中添加信息(相当于vue中的vux)
    handleCartAdd(){
      // console.log("加入购物车成功");
      //1.获取缓存中的购物车数组(缓存技术)，没有就设置cart空数组
      let cart = wx.getStorageSync("cart")||[];
      //2.判断商品对象是否存在于购物车数组中
      let index = cart.findIndex(v=>v.goods_id === this.Goodsinfo.goods_id);
      if(index == -1){
        //3不存在 第一次添加
        this.Goodsinfo.num=1;
        this.Goodsinfo.checked=true;

        cart.push(this.Goodsinfo)
      }else{
        //4存在,购物车商品数量+1
        cart[index].num++;
      }
      //5.把购物车重新弄添加回缓存中
      wx.setStorageSync("cart", cart);
      //6.弹窗提示
      wx.showToast({
        title: '加入购物车成功',
        icon:'success',
        // 不让用户进行其他操作
        mask:true,
      });
    },
    handleCollect(e){
      let isCollect = false;
      //1.获取缓存中的商品收藏数组
      let collect = wx.getStorageSync("collect")||[];
      //2.判断该商品是否被收藏过
      let index = collect.findIndex(v=>v.goods_id === this.Goodsinfo.goods_id);
      //3.当index! =-1表示已经收藏过,进行移除
      if(index!==-1){
        collect.splice(index,1);
        isCollect = false;
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          mask: true,
        });
          
      }else{
        //4.为-1则添加到数组中
        collect.push(this.Goodsinfo)
        isCollect = true;
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          mask: true,
        });

      }
      //5.存入缓存
      wx.setStorageSync("collect", collect);
      //6.添加到data中
      this.setData({
        isCollect
      })
      
    }
})