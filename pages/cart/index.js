import { getSetting, chooseAddress, openSetting, showModal ,showToast} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:true,
    totalPrice:0,
    totalNum:0
  },

  onShow(){
    const address = wx.getStorageSync("address");
    const cart = wx.getStorageSync("cart")||[];
    
    this.setData({
      address
    });
    this.setCart(cart);
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //1、原本没有优化的代码
  //handleChooseAddress(){
    // wx.getSetting({
    //   success: (result) => {
    //     console.log(result);
    //     const scopeAddress=result.authSetting["scope.address"];
    //     if(scopeAddress===true||scopeAddress===undefined){
      //       wx.chooseAddress({
        //         success: (result1) => {
    //           console.log(result1);
    //         }
    //       });
    
    //     }else{
    //       wx.openSetting({
      //         success: (result2) => {
        //           wx.chooseAddress({
    //             success: (result3) => {
      //               console.log(result3);
    //             }
    //           });       
    //         }
    //       });           
    //     }
    //   },
    // });
    //}
  //2、优化的代码
  // async handleChooseAddress() {
    //   try {
      //     // 1 获取 权限状态
      //     const res1 = await getSetting();
  //     const scopeAddress = res1.authSetting["scope.address"];
  //     // 2 判断 权限状态
  //     if (scopeAddress === false) {
    //       await openSetting();
  //     }
  //     // 4 调用获取收货地址的 api
  //     let address = await chooseAddress();
  //     address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
  
  //     // 5 存入到缓存中
  //     wx.setStorageSync("address", address);
  
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  
  //3、以上接口停止使用，scope.address只有true 不再进行获取地址权限控制 直接使用wx-chooseAddress即可
  handleChooseAddress(){
    wx.chooseAddress({
      success: (result) => {
        const address = result;
        address.all=address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        wx.setStorageSync("address", address);
        
      }
    });
    
  },
  handleChangeItem(e){
    const goods_id = e.currentTarget.dataset.id;
    let {cart} = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  setCart(cart){
    let totalPrice = 0;
    let totalNum = 0;
    let allChecked = true;
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      }else{
        allChecked = false;
      }
    });
    allChecked = cart.length!=0?allChecked:false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart);
  },
  //全选全部选
  handleItemAllCheck(){
    // let {cart} = this.data;
    // let {allChecked} = this.data;
    //将上面的写在一起
    let {cart , allChecked} = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart); 
  },
  async handleItemNumEdit(e){
    let {operation , id} = e.currentTarget.dataset;
    let {cart} = this.data;

    const index = cart.findIndex(v => v.goods_id === id);

    if(cart[index].num===1&&operation===-1){
      let res = await showModal({content:"确定要删除吗？"});
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    }else{
      cart[index].num += operation; 
      this.setCart(cart);
    }
  },
  async handlePay(){
    const {address,totalNum} = this.data;

    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    if(totalNum<=0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})