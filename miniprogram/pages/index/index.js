//index.js
const app = getApp()

Page({
  data: {
    currentTab: 'garbage',
    tabs: [{
        id: "garbage",
        title: "分类",
        color: "#f1f1f1",
        icon: "../../images/ic_garbage.png"
      },
      {
        id: "exam",
        title: "测试",
        color: "#ccfad7",
        icon: "../../images/ic_exam.png"
      },
      {
        id: "idea",
        title: "想法",
        color: "#fdd9db",
        icon: "../../images/ic_idea.png"
      },
      {
        id: "city",
        title: "城市",
        color: "#f5ebfe",
        icon: "../../images/ic_check.png"
      }
    ]
  },

  onTabSelect(e) {
    const tabId = e.currentTarget.dataset.tabid;
    console.log("onTabSelect", tabId);
    this.setData({
      currentTab: tabId
    })

    const now = new Date().getMilliseconds();
    wx.cloud.callFunction({
      name: 'getAllGarbages'
    }).then(res => {
      console.log("getAllGarbages => ", res);
      console.log("Cloud cost", new Date().getMilliseconds() - now);

    }).catch(err => {
      wx.hideLoading();
      console.error(err);
    })

    // wx.request({
    //   url: 'https://raw.githubusercontent.com/au-au/garbage-catalog/master/catalog.json',
    //   success: (res) => {
    //     console.log("Request cost", new Date().getMilliseconds() - now);
    //     const items = res.data.data[0].items;
        
    //     // for (let i = 0; i <= items.length; i++) {
          
    //     //   wx.cloud.database().collection("garbages").add({
    //     //     data: {
    //     //       type: "household",
    //     //       typeName: "湿垃圾",
    //     //       name: items[i].name
    //     //     }
    //     //   })
    //     // }
    //   }
    // })
  },

  onLoad(options) {
    const splitToParts = this.data.tabs.length + 1;
    const partWidth = app.globalData.windowWidth / splitToParts;
    this.setData({
      partWidth
    })


    console.log("data==>", app.globalData.garbages);
    
  },
})