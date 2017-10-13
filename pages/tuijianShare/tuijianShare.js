// pages/tuijianShare/tuijianShare.js
var common = require("../../common.js");
var app = getApp();
var sign = wx.getStorageSync('sign');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    received:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
    var that = this;
    var pageSharecode = options.sharecode;
    that.setData({
      pageSharecode: pageSharecode
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var sign = wx.getStorageSync('sign');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    common.getSign(function(){      
      var sign = wx.getStorageSync("sign");
      var pageSharecode = that.data.pageSharecode;
      // pageSharecode = "f58d807ee9f31e24e9d382afe18c6dea";
      wx.request({
        url: 'https://shop.playonwechat.com/api/invitee-page?sign=' + sign + "&sharecode=" + pageSharecode + '&operator_id=' + app.data.kid,
        success: function (res) {
           console.log("分享", res);
          wx.hideLoading();
          var recommends = res.data.data.recommends;
          var arr = res.data.data;
          that.setData({
            arr: arr,
            recommends: recommends
          })
        }
      })
    })
   
  },
  receive:function(){
    var that= this;
    var sign = wx.getStorageSync("sign");
    wx.request({
      url: 'https://shop.playonwechat.com/api/receive-coupon?sign=' + sign + "&cid=1" + '&operator_id=' + app.data.kid,
      success:function(res){
        console.log("领取",res);
        if(res.data.status){
          wx.showToast({
            title: res.data.msg,
          })
          that.setData({
            received: true
          })
        }
      }
    })
    
  },
  // 去详情页
  goTo:function(e){
    console.log(e);
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '../inform/inform?gid=' + gid,
    })
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