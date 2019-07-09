//app.js
var data = require('/data/data.js');
App({
  globalData: {
    garbages: data.data,
    theme: "light"
  },

  getGarbageList() {
    const garbagesSet = this.globalData.garbages;
    var garbages = [];
    for (let i = 0; i < garbagesSet.length; i++) {
      for (let j = 0; j < garbagesSet[i].items.length; j++) {
        var item = garbagesSet[i].items[j];
        item.type = garbagesSet[i].id;
        item.color = garbagesSet[i].color;
        item.typeName = this.getTypeNameByType(garbagesSet[i].id)
        garbages.push(item);
      }
    }
    return garbages;
  },

  getTypeNameByType(type) {
    switch(type) {
      case "household":
        return "湿垃圾";
      case "residual":
        return "干垃圾";
      case "recyclable":
        return "可回收物";
      case "hazardous":
        return "有害垃圾";
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
        _this.globalData.province = res.data.result.ad_info.province;
        _this.globalData.city = res.data.result.ad_info.city
        console.log("Province =>", _this.globalData.province);
        console.log("City =>", _this.globalData.city );
      },

      fail:() => {
        console.log("parseLocation Failed");
      }
    })
  },

  requestLocation() {
    const _this = this;
    wx.getSetting({
      success: (res) => {
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.goAddress();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.getLocation();
        }
        else {
          // console.log('授权成功')
          //调用wx.getLocation的API
          _this.getLocation();
        }
      }
    })
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
        this.requestLocation();
      })
    }
  }
})