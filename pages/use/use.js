// pages/use/use.js
var tcity = require("../../utils/citys.js");
var app = getApp();
var sign = wx.getStorageSync('sign');
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false
  },
  // input
  telNumber: function (e) {
    var that = this;
    that.setData({
      telNumber: e.detail.value
    })
    console.log(that.data.telNumber);
  },
  userName: function (e) {
    var that = this;
    that.setData({
      userName: e.detail.value
    })
    console.log(that.data.userName);
  },
  detailInfo: function (e) {
    var that = this;
    that.setData({
      detailInfo: e.detail.value
    })
    console.log(that.data.detailInfo);
  },
  youbian: function (e) {
    var that = this;
    that.setData({
      youbian: e.detail.value
    })
    console.log(that.data.youbian);
  },
  //地址
  bindChange: function (e) {
    console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })
      console.log(this.data.province);
      console.log(this.data.city);
      console.log(this.data.county);
      
      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
},
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  onLoad: function () {
    console.log("onLoad");
    var that = this;

    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }
    that.setData({
      'provinces': provinces,
      'citys': citys,
      'countys': countys,
      'province': cityData[0].name,
      'city': cityData[0].sub[0].name,
      'county': cityData[0].sub[0].sub[0].name
    })
    console.log('初始化完成');
 },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var dizhi = [];
    dizhi.userName = this.data.userName;
    dizhi.telNumber = this.data.telNumber;
    dizhi.detailInfo = this.data.detailInfo;
    dizhi.youbian = this.data.youbian;
    dizhi.province = this.data.province;
    dizhi.city = this.data.city;
    dizhi.county = this.data.county;
    console.log(dizhi);
    
    wx.showLoading({
      title: '地址数据提交中',
    });
    
    // 跳转收货地址管理
    wx.navigateTo({
      url: '../address/address'
    })
  },
  
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})
