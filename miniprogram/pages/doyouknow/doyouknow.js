// pages/doyouknow/doyouknow.js
const db = wx.cloud.database();
Component({
  options: {
    addGlobalClass: true,
  },

  data: {
    cornercases: [],
    tbds: [],
    showVoteModal:false
  },

  methods: {
    loadAllCornerCases() {
      wx.showLoading({
        title: '正在翻看笔记本...',
      });
      db.collection("cornercases").get()
        .then(res => {
          console.log()
          this.setData({
            cornercases: res.data
          })
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
          console.error("loadAllCornerCases", err)
        })
    },
    loadAllTbd() {
      db.collection("tbds").get()
        .then(res => {
          console.log()
          this.setData({
            tbds: res.data
          })
        })
        .catch(err => {
          console.error("loadAllTbd", err)
        })
    },

    showVoteModal(e) {
      const voteCase = e.currentTarget.dataset.item;
      this.setData({
        currentVoteCase : voteCase,
        showVoteModal : true,
      })
    },

    hideVoteModal(e) {
      this.setData({
        showVoteModal: false,
      })
    },

    vote(e) {
      const type = e.currentTarget.dataset.type;
      this.setData({
        showVoteModal: false,
      })
      db.collection("tbdvotes").add({
        data: {
          voteCase: this.data.currentVoteCase,
          voteType: type
        }
      })
      wx.showToast({
        title: '谢谢你的意见, 我已经拿小本本记下来了!',
        icon: 'none',
        duration: 2000
      })
    }
  }, 
  attached() {
    this.loadAllCornerCases();
    this.loadAllTbd();
  }

})