"use strict";
var httpService = function() {
  function httpService($http, baseUrl) {
    this.$http = $http;
    this.baseTokenUrl = baseUrl;
    this.baseUrl = baseUrl + '/api';
  }
  return ($traceurRuntime.createClass)(httpService, {
    getQuotationResult: function(items) {
      return this.$http.post(this.baseUrl + '/generic/', items);
    },
    getBindingInfo: function(qcId) {
      return this.$http.get(this.baseUrl + '/QuoteCategoryBasicBindingInfo/' + qcId);
    },
    getMenuItems: function(id) {
      return this.$http.get(this.baseUrl + '/Menu/' + id);
    },
    registerAccount: function(info) {
      return this.$http.post(this.baseUrl + '/account/Register', info);
    },
    requestAccessToken: function(loginInfo) {
      return this.$http({
        method: 'POST',
        url: this.baseTokenUrl + '/Token',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: loginInfo
      });
    }
  }, {});
}();
var $__default = httpService;
httpService.$inject = ['$http', 'baseUrl'];
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=httpService.js.map
