// pages/garbagecollection/search/search.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    garbages: [],
    input:'',
    toolbarHeight: getApp().globalData.toolbarHeight,
  },

  clearInput() {
    let garbages = this.data.garbages;
    for (let i = 0; i < garbages.length; i++) {
      garbages[i].isHidden = false;
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

  loadAllGarbages() {
    db.collection('garbages').get()
    .then(res => {
      this.setData({
        garbages: res.data
      })
    }).catch(error => {
      console.error('loadAllGarbages', error)
    })
  },

  search(key) {
    let garbages = this.data.garbages;
    for (let i = 0; i < garbages.length; i++) {
      garbages[i].isHidden = garbages[i].name.search(key) == -1;
    }
    this.setData({ garbages })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadAllGarbages();
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