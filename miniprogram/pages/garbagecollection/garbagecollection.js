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
    theme: app.globalData.theme,
    showDetailCard: false,
    currentShowItemIndex: -1,
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
    tabs: app.globalData.garbages,
    garbages: app.globalData.garbages
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

    showDetailCard(e) {
      this.setData({
        currentShowItemIndex: e.currentTarget.dataset.index,
        showDetailCard: true
      })
    },

    correct(e) {
      const garbage = e.currentTarget.dataset.correct;
      wx.showToast({
        title: '我知道了，但我不想改',
        icon:"none"
      })
      db.collection("correct").add({
        data: {
          data: garbage
        }
      })
    },

    hideDetailCard() {
      this.setData({
        showDetailCard: false
      })
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
    if (!app.globalData.city) {
      this.getLocation();
    } else {
      this.setData({
        location: {
          province: app.globalData.province,
          city: app.globalData.city
        }
      })
    }
  }
})