// pages/exam/exam.js
const app = getApp();
const BIN_SIZE = 4;
const TEST_CASES_SIZE = 10;
const GARBAGE_RECT_WIDTH = 60; // px
const GARBAGE_RECT_HEIGHT = 60; // px
const TEST_CASE_NAME_WIDTH = 300; // px

const db = wx.cloud.database();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 页面的初始数据
   */
  data: {
    garbageRectWidth: GARBAGE_RECT_WIDTH,
    garbageRectHeight: GARBAGE_RECT_HEIGHT,
    examFinished: false,
    currentTestCaseIndex: 0,
    testCaseNameWidth: TEST_CASE_NAME_WIDTH,
    testCases: [],
    passedCount: 0,
    garbages: app.getGarbageList(),
    bins: [{
        bg: {
          standBy: "../../images/bin/ic_household.png",
          uncap: "https://6763-gc-v3a9g-1259563504.tcb.qcloud.la/bin/t3_1.png?sign=c9346b9ff5116f619e1c0985a0b63474&t=1562229997"
        }
      },
      {
        bg: {
          standBy: "../../images/bin/ic_residual.png",
          uncap: "https://6763-gc-v3a9g-1259563504.tcb.qcloud.la/bin/t2_1.png?sign=ec889c842020246ef1359920d46c5922&t=1562231149"
        }
      },
      {
        bg: {
          standBy: "../../images/bin/ic_recyclable.png",
          uncap: "https://6763-gc-v3a9g-1259563504.tcb.qcloud.la/bin/t4_1.png?sign=01e03363084c9286d29327ce5fcb4d40&t=1562230020"
        }
      },
      {
        bg: {
          standBy: "../../images/bin/ic_hazardous.png",
          uncap: "https://6763-gc-v3a9g-1259563504.tcb.qcloud.la/bin/t1_1.png?sign=9e3b21dfd2aee76842d6f24b6a517d26&t=1562229956"
        }
      }
    ],
    binHasUncaped: false,
    currentUncapIndex: -1,
  },

  methods: {
    onObjectMove(e) {
      console.log("onObjectMove", e.detail)
      let x = e.detail.x;
      let y = e.detail.y;

      var currentUncapIndex = parseInt((x + GARBAGE_RECT_WIDTH / 2) / (this.data.containerWidth / BIN_SIZE));
      var binHasUncaped = this.data.binHasUncaped;
      if (y > this.data.binUncapY * 0.8) {
        binHasUncaped = true;
      } else {
        currentUncapIndex = -1;
      }

      if (binHasUncaped != this.data.binHasUncaped || currentUncapIndex != this.data.currentUncapIndex) {
        console.log("Change to " + currentUncapIndex + ", " + binHasUncaped)
        this.setData({
          currentUncapIndex,
          binHasUncaped
        })
      }
    },

    onObjectTouchEnd(e) {
      if (this.data.examFinished) {
        this.setData({
          binHasUncaped: false,
          currentUncapIndex: -1
        })
        return
      }
      const binIndex = this.data.currentUncapIndex;
      var testCaseIndex = this.data.currentTestCaseIndex;
      var testCases = this.data.testCases;
      const testCase = testCases[testCaseIndex];
      console.log("Choose bin ==> ", binIndex);

      if (binIndex < 0) {
        return
      }

      var passed = false;
      if ((binIndex == 0 && testCase.type === 'household') ||
        (binIndex == 1 && testCase.type === 'residual') ||
        (binIndex == 2 && testCase.type === 'recyclable') ||
        (binIndex == 3 && testCase.type === 'hazardous')) {
        passed = true;
      }

      var passedCount = this.data.passedCount;
      if (passed) {
        testCases[testCaseIndex].passed = true
        passedCount++;
      }
      var examFinished = false;
      if (testCaseIndex < testCases.length - 1) {
        testCaseIndex++;
        app.globalData.currentTestCaseIndex = testCaseIndex;
      } else {
        examFinished = true;
        app.globalData.currentTestCaseIndex = -1;
      }
      console.log("Passed ==> ", passed);
      this.setData({
        testCases,
        examFinished,
        passedCount,
        currentTestCaseIndex: testCaseIndex,
        binHasUncaped: false,
        currentUncapIndex: -1,
        garbageInitialLeft: this.data.garbageInitialLeft,
      })
    },

    startExam() {
      console.log("startExam");
      // Clear data
      this.setData({
        examFinished: false,
        currentTestCaseIndex: 0,
        testCases: [],
        passedCount: 0,
        binHasUncaped: false,
        currentUncapIndex: -1,
      })

      this.generateTestCases();
    },

    generateTestCases() {
      var testCases = [];
      var testCaseIndex = 0;
      if (app.globalData.currentTestCases 
        && app.globalData.currentTestCaseIndex < TEST_CASES_SIZE
        && app.globalData.currentTestCaseIndex > 0) {
        testCases = app.globalData.currentTestCases;
        testCaseIndex = app.globalData.currentTestCaseIndex;
      } else {
        const garbages = this.data.garbages;
        var testCasesIndex = [];
        const testCaseSize = garbages.length < TEST_CASES_SIZE ? garbages.length : TEST_CASES_SIZE;

        while (testCasesIndex.length < testCaseSize) {
          let random = Math.floor((Math.random() * garbages.length));

          if (!testCasesIndex.includes(random)) {
            testCasesIndex.push(random);
          }
        }

        for (let i = 0; i < testCasesIndex.length; i++) {
          testCases.push(garbages[testCasesIndex[i]])
        }
        app.globalData.currentTestCases = testCases;
      }
      this.setData({
        testCases,
        currentTestCaseIndex: testCaseIndex
      })

      console.log("testCases", testCases);
    },

    test() {
      this.setData({
        binUncapY: this.data.binUncapY - 100
      })
      console.log("test", this.data.binUncapY)
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  attached() {
    const containerWidth = app.globalData.windowWidth;
    const containerHeight = app.globalData.windowHeight - 50;
    const binWidth = (containerWidth / BIN_SIZE) * 0.8;
    const binHeight = binWidth * 1.68;
    const binStandByY = containerHeight - binHeight;
    const binUncapY = binStandByY * 0.9;
    const binGap = (containerWidth - binWidth * BIN_SIZE) / 4;
    const garbageInitialLeft = containerWidth / 2 - GARBAGE_RECT_WIDTH / 2;
    const garbageInitialTop = containerHeight / 2 - GARBAGE_RECT_HEIGHT / 2;
    const testCaseNameLeft = containerWidth / 2 - TEST_CASE_NAME_WIDTH / 2;
    console.log("binStandByY", binStandByY)
    console.log("binUncapY", binUncapY)
    console.log("binWidth", binWidth)
    console.log("garbageInitialLeft", garbageInitialLeft)
    console.log("garbageInitialTop", garbageInitialTop)


    // Setup bins initial margin
    let bins = this.data.bins;
    bins[0].x = binGap / 2;
    bins[1].x = binGap + binWidth + binGap / 2;
    bins[2].x = 2 * binGap + 2 * binWidth + binGap / 2;
    bins[3].x = 3 * binGap + 3 * binWidth + binGap / 2;

    this.setData({
      containerWidth,
      containerHeight,
      garbageInitialLeft,
      garbageInitialTop,
      binWidth,
      binHeight,
      binStandByY,
      binUncapY,
      binGap,
      bins,
      testCaseNameLeft
    })

    if (!app.globalData.garbages) {
      db.collection("garbages").get().then(res => {
        app.globalData.garbages = res.data;
        this.startExam();
      })
    } else {
      this.startExam();
    }
  }
})