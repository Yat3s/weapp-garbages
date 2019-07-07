// pages/garbagecollection/garbagecollection.js
const db = wx.cloud.database();
const app = getApp();
const HEADER_HEIGHT = 180; // px
const DEFAULT_CONTENT_CORNER_RADIUS = 24; // px
const DEFAULT_TAB_CONTENT_WIDTH_PERCENT = 100 // Percent
const COLLASPED_TAB_CONTENT_WIDTH_PERCENT = 60 // Percent
const DEFAULT_TAB_TEXT_SIZE = 28 // rpx
const COLLASPED_TAB_TEXT_SIZE = 20 // rpx

Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    tabCornerRadius: DEFAULT_CONTENT_CORNER_RADIUS,
    headerHeight: HEADER_HEIGHT,
    currentTabIndex: 0,
    statusBarHeight: app.globalData.statusBarHeight,
    tabBarHeight: app.globalData.toolbarHeight - app.globalData.statusBarHeight,
    tabTextSize: DEFAULT_TAB_TEXT_SIZE,
    defaultTabTextSize: DEFAULT_TAB_TEXT_SIZE,
    tabContentWidthPercent: DEFAULT_TAB_CONTENT_WIDTH_PERCENT,
    tabBarCollapsed: false,
    tabs: [{
      title: "湿垃圾",
      abbr: "湿",
      color: "",
      description: "湿垃圾又称为厨余垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。"
    }, {
      title: "干垃圾",
      abbr: "干",
      color: "",
      description: "湿垃圾又称为厨余垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。"
    }, {
      title: "可回收物",
      abbr: "回收",
      color: "",
      description: "湿垃圾又称为厨余垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。"
    }, {
      title: "有害垃圾",
      abbr: "有害",
      color: "",
      description: "湿垃圾又称为厨余垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。"
    }],
    garbages: null
  },
  methods: {
    goSearch() {
      wx.navigateTo({
        url: '/pages/garbagecollection/search/search'
      })
    },

    tabSelect(e) {
      this.setData({
        currentTabIndex: e.currentTarget.dataset.id
      })
    },

    getGarbagesByType(type) {
      db.collection("garbages").get()
        .then(res => {
          console.log("garbages=> ", res);
          this.setData({
            garbages: res.data
          })
        }).catch(err => {
          console.error("garbages=> ", err);
        })
    },

    onPageScroll(e) {
      console.log("onPageScroll", e);
    },

    onScrollChange(e) {
      const scrollY = e.detail.scrollTop;
      let tabBarCollapsed = scrollY >= HEADER_HEIGHT;
      let headerOffsetPercent = (scrollY / HEADER_HEIGHT > 1) ? 1 : scrollY / HEADER_HEIGHT
      let tabCornerRadius = DEFAULT_CONTENT_CORNER_RADIUS * (1 - headerOffsetPercent)
      let tabContentWidthPercent = DEFAULT_TAB_CONTENT_WIDTH_PERCENT - (DEFAULT_TAB_CONTENT_WIDTH_PERCENT - COLLASPED_TAB_CONTENT_WIDTH_PERCENT) * headerOffsetPercent;
      let tabTextSize = DEFAULT_TAB_TEXT_SIZE - (DEFAULT_TAB_TEXT_SIZE - COLLASPED_TAB_TEXT_SIZE) * headerOffsetPercent;
      tabCornerRadius = tabCornerRadius < 0 ? 0 : tabCornerRadius

      console.log("onScrollChange", "tabCornerRadius =>" + tabCornerRadius + ", tabContentWidthPercent =>" + tabContentWidthPercent + ", Top = " + e.detail.scrollTop + ", deltaY = " + e.detail.deltaY)
      if (tabBarCollapsed != this.data.tabBarCollapsed) {
        this.setData({
          tabBarCollapsed
        })
      }
      if (!tabBarCollapsed) {
        this.setData({
          tabCornerRadius,
          tabContentWidthPercent,
          tabTextSize
        })
      }
    }
  },
  attached() {
    this.getGarbagesByType(0);
  }
})