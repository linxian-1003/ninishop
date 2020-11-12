// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待发货",
        isActive:false
      },
      {
        id:2,
        value:"待收货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],

  },
  onShow(options){
    let pages =  getCurrentPages();
    const currentPage = pages[pages.length-1];
    let {type} = currentPage.options;
    this.changeTitleByIndex(type-1)
    
      
  },
  changeTitleByIndex(index){
    let {tabs} = this.data;
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    });
  },
  handleTabsItemChange(e){
    const {index} = e.detail;
    this.changeTitleByIndex(index);
  },
  
})