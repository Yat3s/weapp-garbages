//index.js
const app = getApp()
const BONUS_MENU_WIDTH_PERCENT = 0.2 // percent

Page({
  data: {
    theme: app.globalData.theme,
    currentTab: 'garbage',
    bonusMenuWidthPercent: BONUS_MENU_WIDTH_PERCENT * 100,
    tabs: [{
        id: "garbage",
        title: "分类",
        color: "#f1f1f1",
        icon: "../../images/ic_garbage.png"
      },
      {
        id: "doyouknow",
        title: "你知道吗",
        color: "#e7e1fb",
        icon: "../../images/ic_doyouknow.png"
      },
      {
        id: "exam",
        title: "测试",
        color: "#ccfad7",
        icon: "../../images/ic_exam.png"
      },
      {
        id: "profile",
        title: "关于",
        color: "#f5ebfe",
        icon: "../../images/ic_idea.png"
      }
    ]
  },

  bonus() {
    var step = app.globalData.bonusStep;
    switch (step) {
      case 0: 
        wx.showToast({
          title: '再点我一下试试？',
          icon:"none",
          duration: 2000
        })
        step++
        break;
      case 1:
        wx.showToast({
          title: '你好像发现了什么新功能？',
          icon: "none",
          duration: 2000
        })
        step++
        break;
      case 2:
        wx.showModal({
          title: 'What?',
          content: '不小心触发了某些bug，天空变成灰色了',
          showCancel: false
        })
        step++
        break;
      case 3:
        wx.showModal({
          title: 'What?',
          content: '我可以帮你把颜色改回来，并且还可以告诉你一个小秘密',
          confirmText: "说吧",
          cancelText: "不感兴趣",
          success(res) {
            if (res.confirm) {
              step++;
              this.bonus()
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
    }

    app.globalData.bonusStep = step;
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
    const partWidth = (1 - BONUS_MENU_WIDTH_PERCENT) * app.globalData.windowWidth / splitToParts;
    this.setData({
      partWidth
    })
    console.log("data==>", app.globalData.garbages);
  },
})