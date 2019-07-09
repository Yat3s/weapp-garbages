// pages/garbagecollection/search/search.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    garbages: [],
    input:'',
    colors: [
      {
        bg: "#009688",
        fg: "#FFFFFF"
      },
      {
        bg: "#3F51B5",
        fg: "#FFFFFF"
      },
      {
        bg: "#E91E63",
        fg: "#FFFFFF"
      },
      {
        bg: "#9C27B0",
        fg: "#FFFFFF"
      },
      {
        bg: "#795548",
        fg: "#FFFFFF"
      }],
    toolbarHeight: getApp().globalData.toolbarHeight,
  },

  clearInput() {
    let garbages = this.data.garbages;
    for (let i = 0; i < garbages.length; i++) {
      garbages[i].isShow = true;
    }
    this.setData({
      input: "",
      garbages
    })
   
  },

  onSearchChange(e) {
    let key = e.detail.value.toLowerCase();
    this.setData({
      input: key
    })

    this.search(key);
  },

  search(key) {
    let garbages = this.data.garbages;
    for (let i = 0; i < garbages.length; i++) {
      garbages[i].isShow = garbages[i].name.search(key) != -1;
    }
    this.setData({ garbages })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var garbages = app.getGarbageList();
    console.log(garbages);
    for (let i = 0; i < garbages.length; i++) {
      garbages[i].isShow = true;
    }

    this.setData({ garbages });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})