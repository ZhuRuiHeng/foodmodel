// pages/login/login.js
var app = getApp();
var sign = wx.getStorageSync('sign');
Page({
  data: {
    inputValue: '',
    second: 60,
    selected: false,
    selected1: true,
    pagePath: "",
    verifyCode: "",
  },

  onLoad: function (options) {
    var sign = wx.getStorageSync('sign');
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var app = getApp();
    console.log(app.data);
    that.setData({
      sign: sign
    })
    wx.showShareMenu({
      withShareTicket: true
    })

    //console.log(options);
    var pagePath = options.pagePath;
    var page = options.pages
    that.setData({
      pagePath: pagePath,
      page: page
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 获取手机验证码
  getphone: function () {
    var that = this;
    var mobile = that.data.inputValue;
    //console.log(mobile);

    if (mobile == "" || mobile == undefined) {
      wx.showToast({
        title: '请填写正确手机号码',
        image: '../img/tip_icon_warn.png'
      });
    } else {
      wx.request({
        url: 'https://hepulan-skin-care-center.omnistatic.com/site/send-code?sign=' + sign + '&operator_id=' + app.data.kid,
        data: {
          mobile: mobile,
        },
        success: function (res) {
          var second = that.data.second;
          that.setData({
            selected: true,
            selected1: false,
            loginStatic: true
          });
          app.data.loginStatic = true;
          var time = setInterval(function () {
            if (second > 0) {
              second = second - 1;
              that.setData({
                second: second
              });
            } else {
              that.setData({
                selected: false,
                selected1: true,
                second: 60,
              })
              clearInterval(time);
            }
          }, 1000);
          //console.log("验证码" + res);
        }
      })
    }
  },

  verifyCode: function (code) {
    //console.log(code.detail.value);
    var that = this;
    this.setData({
      verifyCode: code.detail.value
    })
    //console.log(that.data.verifyCode);
  },

  loginIn: function (res) {
    // 登录
    var that = this;
    //console.log(that.data.inputValue);
    var mobile = that.data.inputValue;
    var pagePath = that.data.pagePath;
    var verifyCode = that.data.verifyCode;
    var page = that.data.page;
    var sign = sign;
    if (!(/^1[34578]\d{9}$/.test(that.data.inputValue))) {
      wx.showToast({
        title: '请填写正确手机号码',
        image: '../images/tip_icon_warn.png'
      });
      return;
    }
    wx.request({
      url: 'https://hepulan-skin-care-center.omnistatic.com/site/verify-code?sign=' + sign + '&operator_id=' + app.data.kid,
      data: {
        mobile: mobile,
        code: verifyCode
      },
      success: function (res) {
        //console.log(res);
        var keyCode = res.data.status;
        var msg = res.data.msg;
        var app = getApp();
        if (keyCode == 0) {
          wx.showToast({
            title: msg,
            image: '../images/tip_icon_warn.png'
          });
        } else {
          wx.request({
            url: 'https://hepulan-skin-care-center.omnistatic.com/site/check-member-via-mobile?sign=' + sign + '&operator_id=' + app.data.kid,
            data: {
              mobile: mobile,
            },
            success: function (res) {
              console.log(res);
              var teacherId = res.data.data.hpl_t_id;
              var wxcode = res.data.data.wxcode;
              var addGoldImg = "";
              var goldimg = that.data.golddImg;
              console.log(that.data);
              addGoldImg = that.data.goldImg[3].imgUrl;
              wx.setStorageSync("teacherId", teacherId);
              app.data.teacherId = teacherId;
              app.data.wxcode = wxcode;
              app.data.loginStatic = true;
              that.setData({
                addImgDis: "flex",
                addGoldImg: addGoldImg
              });
              setTimeout(function () {
                that.setData({
                  addImgDis: "none"
                });
              }, 1000)
              app.data.mobile = mobile;
              console.log(app.data);
              setTimeout(function () {
                if (page == "ask_me") {
                  wx.switchTab({
                    url: pagePath
                  })
                } else {
                  wx.redirectTo({
                    url: pagePath + "?teacherId=" + teacherId + "&wxcode=" + wxcode
                  })
                }
              }, 1000)
            }
          });
        }
      }
    })


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var sign = wx.getStorageSync('sign');
    console.log("页面显示");
    var that = this;

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
