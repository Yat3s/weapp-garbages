//app.js
App({
  globalData: {

  },
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    wx.getSystemInfo({
      success: e => {
        this.globalData.screenHeight = e.screenHeight;
        this.globalData.screenWidth = e.screenWidth;
        this.globalData.windowWidth = e.windowWidth;
        this.globalData.windowHeight = e.windowHeight;

        this.globalData.statusBarHeight = e.statusBarHeight;
        let toolbar = wx.getMenuButtonBoundingClientRect();

        this.globalData.toolbar = toolbar;
        this.globalData.toolbarHeight = toolbar.bottom + toolbar.top - e.statusBarHeight;
        console.log("statusBarHeight", e.statusBarHeight)
        console.log("toolbarHeight", this.globalData.toolbarHeight)
      }
    })

    if (!this.globalData.garbages) {
      wx.showLoading({
        title: 'Loading',
      });
      wx.cloud.database().collection("garbages").get().then(res => {
        this.globalData.garbages = res.data;
        console.log("Global load garbages =>", res);
        wx.hideLoading();
      })
    }
  }
})