// pages/garbagecollection/garbagecollection.js
const db = wx.cloud.database();
const app = getApp();
const HEADER_HEIGHT = 200; // px

const DEFAULT_HEADER_TOP = 0; // px
const COLLAPSED_HEADER_TOP = -50; // rpx
Component({
  options: {
    addGlobalClass: true,
  },

  /**
   * 页面的初始数据
   */
  data: {
    toView: "",
    headerHeight: HEADER_HEIGHT,
    currentTabIndex: 0,
    headerTop: DEFAULT_HEADER_TOP,
    location: {
      city: app.globalData.city,
      province: app.globalData.province
    },
    statusBarHeight: app.globalData.statusBarHeight,
    tabBarHeight: app.globalData.toolbarHeight - app.globalData.statusBarHeight,
    tabBarCollapsed: false,
    tabs: [{
      id:"household",
      title: "湿垃圾",
      abbr: "湿",
      color: "#4CC591",
      description: "湿垃圾又称为厨余垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。"
    }, {
        id: "residual",

      title: "干垃圾",
      abbr: "干",
      color: "#FE7647",
      description: "湿垃圾又称为厨余垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。"
    }, {
      id: "recyclable",
      title: "可回收物",
      abbr: "回收",
      color: "#8E98FD",
      description: "湿垃圾又称为厨余垃圾，即易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。"
    }, {
      id: "hazardous",
      title: "有害垃圾",
      abbr: "有害",
      color: "#182B88",
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
      console.log(e);
      const tabFrom = e.currentTarget.dataset.from;
      const toView = tabFrom === 'collapsed' ? 'tabbar' : ''
      this.setData({
        currentTabIndex: e.currentTarget.dataset.id,
        toView
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
      let headerOffsetPercent = (scrollY / HEADER_HEIGHT > 1) ? 1 : scrollY / HEADER_HEIGHT;
      let headerTop = COLLAPSED_HEADER_TOP * headerOffsetPercent;

      if (tabBarCollapsed != this.data.tabBarCollapsed) {
        this.setData({
          tabBarCollapsed
        })
      }
      if (!tabBarCollapsed) {
        this.setData({
          headerTop
        })
      }
    },

    getLocation() {
      const _this = this;
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
          console.log("getLocation", res);
          _this.parseLocation(latitude, longitude)
        }
      })
    },

    parseLocation(lat, lon) {
      const _this = this;
      const url = "https://apis.map.qq.com/ws/geocoder/v1/?location=" + lat + "," + lon + "&key=EIOBZ-GTTRJ-JEIFC-FYUNA-2QZE5-IYBQ7";
      wx.request({
        url: url,
        success: (res) => {
          console.log("parseLocation", res);
          const province = res.data.result.ad_info.province;
          const city = res.data.result.ad_info.city;
          app.globalData.province = province;
          app.globalData.city = city;
          console.log("Province =>", province);
          console.log("City =>", city);
          _this.setData({
            location: {
              province,
              city
            }
          })
        },

        fail: () => {
          console.log("parseLocation Failed");
        }
      })
    },
  },
  attached() {
    this.getGarbagesByType(0);
    this.getLocation();
  }
})