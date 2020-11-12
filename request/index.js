//同时发送异步代码的次数
let ajaxTimes = 0;
export const request=(params)=>{
    let header = {...params.header};
    if(params.url.includes("/my/")){
        header["Authorization"] = wx.getStorageSync("token");
          
    }
    
    ajaxTimes++;
    //显示加载中
    wx.showLoading({
        title: '加载中',
        //是否显示透明蒙层，防止触摸穿透
        mask:true
    })

    //抽取url公共部分
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            header:header,
            url:baseUrl+params.url,
            success:(result)=>{
                resolve(result.data.message);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes===0){
                    //关闭加载中
                    wx.hideLoading();
                }
            }

        });
          
    })
}