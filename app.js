
//app.js

App({
  data: {
    loginData: null,
    sign: "",
    mobile: "",
    wx_name: "",
    mid: "",
    sharecode: "",
    authStatic: false,
    loginStatic: false,
    authSuccess: false
  },
  onLaunch: function () {
    var that =this;
    wx.showShareMenu({
      withShareTicket: true
    })
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    this.data.kid = extConfig.kid;
    this.data.kid = 66;//extConfig.kid;

    //console.log(this.data.kid);
    wx.setStorageSync('kid', this.data.kid);
   // console.log('111', this.data.kid);
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    // var value = wx.getStorageSync('mobile');
   
    logs.unshift(Date.now())  
    wx.setStorageSync('logs', logs);
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      
      success: function (res) {
        
        if (res.code) {
          console.log(res.code);
          //发起网络请求
          wx.request({
            url: 'https://shop.playonwechat.com/api/auth?code=${res.code}' + '&operator_id=' + that.data.kid,
            data: {
              code: res.code
            },
            success: function (res) {
              
              console.log(res);
              that.data.sign = res.data.data.sign;
              // that.data.mobile = res.data.data.mobile;
              that.data.loginData = res.data.data.sign;
              that.data.sharecode = res.data.data.sharecode;
              try {
                // wx.setStorageSync('mobile', res.data.data.mobile);
                wx.setStorageSync('sharecode', res.data.data.sharecode);
                wx.setStorageSync('sign', res.data.data.sign);
                wx.setStorageSync('loginData', res.data.data.sign);
                wx.setStorageSync('loginData', res.data.data.mid);
                // that.data.mobile = res.data.data.mobile;
                that.data.mid = res.data.data.mid;
                wx.getUserInfo({
                  success: function (res) {
                    //console.log(res);
                    var userData = {};
                    var userInfo = res.userInfo
                    var nickName = userInfo.nickName
                    var avatarUrl = userInfo.avatarUrl
                    var gender = userInfo.gender //性别 0：未知、1：男、2：女
                    var province = userInfo.province
                    var city = userInfo.city
                    var country = userInfo.country
                    wx.setStorageSync('avatarUrl', avatarUrl);
                    wx.setStorageSync('nickName', nickName);
                    that.data.username = nickName;
                    that.data.avatarUrl = avatarUrl;
                    userData = {
                      wx_name: nickName,
                      avatarUrl: avatarUrl,
                      gender: gender,
                      province: province,
                      city: city,
                      country: country
                    };
                    wx.request({
                      url: 'https://shop.playonwechat.com/api/save-user-info?sign=' + that.data.sign + '&operator_id=' +  '&operator_id=' + that.data.kid,
                      method: 'POST',
                      data: {
                        info: userData
                      },
                      success: function (res) {
                        //console.log(res);
                        that.data.authSuccess = true
                        setTimeout(function () {
                          wx.hideLoading()
                        }, 500)
                      }
                    })
                  },
                  fail: function () {
                    console.log("用户拒绝授权");
                    wx.showModal({
                      title: '警告',
                      content: '您点击了拒绝授权，将无法正常使用体验。请10分钟后再次点击授权，或者删除小程序重新进入。',
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        }
                      }
                    })
                    wx.openSetting({
                      success: (res) => {
                        console.log(res);
                      }
                    })
                  },
                })
              } catch (e) {
                console.log("回话异常：" + e);

              }

            },
          })

        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    });
  },

  globalData: {
    userInfo: null,
    sign: ""
  }
 
})
