//index.js
const app = getApp()

Page({
  data: {
    currentTab: 'garbage',
    tabs: [{
      id:"garbage",
        title: "分类",
        color:"#f1f1f1",
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
  },

  onLoad(options) {
    const splitToParts = this.data.tabs.length + 1;
    const partWidth = app.globalData.windowWidth / splitToParts;
    this.setData({
      partWidth
    })
  },
})