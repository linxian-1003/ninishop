//通过过引用来发送请求 方法 一定要把路径补全
import { request } from "../../request/index.js";
Page({
  data: {
    //轮播图效果
    swiperList:[],
    cateList:[],
    floorList:[]
  },
  //options(Object)
  onLoad: function(options) {
     /**,
    //wx-req
    wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
      success: (result) => {
        this.setData({
          swiperList:result.data.message
        })
      }
     
      //fail: () => {},
      //成功或者失败都会调用
      //complete: () => {} 
    });*/

    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
    
  },
  //获取轮播图数据
  getSwiperList(){
    request({url:"/home/swiperdata"})
    .then(result=>{
      this.setData({
        swiperList:result
      })
    })
  },
  //获取导航数据
  getCateList(){
    request({url:"/home/catitems"})
    .then(result=>{
      this.setData({
        cateList:result
      })
    })
  },
  //获取楼层数据
  getFloorList(){
    request({url:"/home/floordata"})
    .then(result=>{
      this.setData({
        floorList:result
      })
    })
  }


});
  