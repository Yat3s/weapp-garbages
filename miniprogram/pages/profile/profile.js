// pages/profile/profile.js
const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: app.globalData.windowHeight,
    windowWidth: app.globalData.windowWidth,
    city: app.globalData.city,
    modalMessage: "",
    showModal: false
  },

  methods: {
    leaveMe() {
      this.setData({
        showModal: true,
        modalMessage: "祝君安好！"
      })
    },

    hideModal() {
      this.setData({
        showModal: false
      })
    }

  }
})