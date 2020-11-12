import { getSetting, chooseAddress, openSetting, showModal ,showToast, login} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  async handleGetUserInfo(e){
    //获取到的token为null
    // const { encryptedData, rawData, iv, signature }= e.detail;
    // const {code} = await login();

    // const loginParams = {encryptedData,rawData,iv,signature,code};

    // const res=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    // console.log(res);

    //所以直接将一个给token赋值 再加入缓存
    try{

      wx.setStorageSync("token", "BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
      wx.navigateBack({
        delta: 1
      });
    }catch(error){
      console.log(error);
    }
      
  }
})