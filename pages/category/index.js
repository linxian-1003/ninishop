//通过过引用来发送请求 方法 一定要把路径补全
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liftMenuList:[],
    rightContent:[],
    currentIndex:0,
    scrollTop:0

  },
  //必须写在这里 否则 this.Cates[index].children; 会报错
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const Cates = wx.getStorageSync("cates");
    if(!Cates){
      this.getCates()
    }else{
      if(Date.now()-Cates.time>1000*10){
        this.getCates()
      }else{
        this.Cates = Cates.data;
        let liftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          liftMenuList,
          rightContent
        })
      }
    }
  },
  async getCates(){
    // request({url:"/categories"})
    // .then(result=>{
    //   //不是data内的可以不用setData
    //   this.Cates = result.data.message;
    //   console.log("将this.Cates存入缓存中")
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates}); 
    //   let liftMenuList = this.Cates.map(v=>v.cat_name);
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     liftMenuList,
    //     rightContent
    //   })
    // })

    //使用es7来使用 async的 await来发送异步请求
    const res = await request({url:"/categories"});
    this.Cates = res;
    console.log("将this.Cates存入缓存中")
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates}); 
    let liftMenuList = this.Cates.map(v=>v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      liftMenuList,
      rightContent
    })

  },
  handleItemTap(e){
    const {index} = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      //点击左侧菜单 重新设置滚动条高度 
      scrollTop:0
    })
  }

})