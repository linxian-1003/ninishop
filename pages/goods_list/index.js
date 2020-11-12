//通过过引用来发送请求 方法 一定要把路径补全
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ],
    goodsList:[]

  },
  //接口必要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数 因为是在另外的方法使用 所以设成全局变量
  totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cat_id;
    this.getGoodsList();
  },
  handleTabsItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    });
  },
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    this.totalPages = Math.ceil(res.total/this.QueryParams.pagesize);
    this.setData({
      goodsList:[...this.data.goodsList,...res.goods]
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },
  //页面上拉触底事件的处理函数
  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有下一页数据了'
      });
        
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //下拉事件
  onPullDownRefresh(){
    this.setData({
      getGoodsList:[]
    });
    //不清除的话 回到顶部再下拉 数据有重复拼接
    this.QueryParams.pagenum=1;
    this.getGoodsList();
  }

})