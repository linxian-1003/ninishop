import { getSetting, chooseAddress, openSetting, showModal ,showToast,requestPayment} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },

  onShow(){
    const address = wx.getStorageSync("address");
    //要重新设值的就用let const是read-only
    let cart = wx.getStorageSync("cart")||[];

    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  async handleOrderPay(){
    try{

      let token = wx.getStorageSync("token");
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index'
        });
      }

      token = wx.getStorageSync("token");
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;

      //const header = { Authorization: token };
  
      console.log(token);
      let goods = [];
      const cart = this.data.cart;
  
      console.log(cart);
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }));
  
      const orderParams = {order_price,consignee_addr,goods};
  
      console.log(orderParams);
  
      //应该是token失效了 res的结果是null //header:header 可只写 header
      const {order_number} = await request({url: "/my/orders/create", method: "POST", data: orderParams})||"";
       // 5 发起 预支付接口
       const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } })||{};
       // 6 发起微信支付 
       await requestPayment(pay);
       // 7 查询后台 订单状态
       const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
       await showToast({ title: "支付成功" });
       // 8 手动删除缓存中 已经支付了的商品
       let newCart=wx.getStorageSync("cart");
       newCart=newCart.filter(v=>!v.checked);
       wx.setStorageSync("cart", newCart);
         
       // 8 支付成功了 跳转到订单页面
       wx.navigateTo({
         url: '/pages/order/index'
       });
    }catch(error){
      await showToast({ title: "支付失败" })
      console.log(error);
    }


  }
})