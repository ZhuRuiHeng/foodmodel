// pages/tuijian/tuijian.js
var app = getApp();
var sign = wx.getStorageSync('sign')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    var sign = wx.getStorageSync('sign');
    var that = this;
    var coupon_info = wx.getStorageSync("coupon_info");
    that.setData({
      coupon_info: coupon_info 
    })
  },

  // 生成二维码
  erwei: function () {
    var sign = wx.getStorageSync("sign");
    wx.request({
      url: 'https://shop.playonwechat.com/api/create-qrcode?sign=' + sign + '&operator_id=' + app.data.kid,
      success:function(res){
        console.log("二维码",res);
        if(res.data.status){
          var url = res.data.url;
          wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: [url] // 需要预览的图片http链接列表
          })
        }
      }
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
    var sharecode = wx.getStorageSync("sharecode");
    return {
      title: '邀请有奖',
      path: '/pages/tuijianShare/tuijianShare?sharecode=' + sharecode + '&operator_id=' + app.data.kid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})