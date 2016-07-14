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
    },
    getUserInfo: function() {
      return this.$http.get(this.baseUrl + "/Account/UserInfo");
    },
    getAllQuoteCategories: function(companyId) {
      return this.$http.get(this.baseUrl + '/QuoteCategory/' + companyId);
    },
    getAllParts: function(qcid) {
      return this.$http.get(this.baseUrl + '/QuotePart/' + qcid);
    },
    turnOnOffQuoteCategory: function(message) {
      return this.$http.post(this.baseUrl + '/QuoteCategory/TurnOnOff', message);
    },
    getQuoteMachineries: function(quoteCategoryId) {
      return this.$http.get(this.baseUrl + '/QuoteMachinery/' + quoteCategoryId);
    },
    turnOnOffQuoteMachinery: function(message) {
      return this.$http.post(this.baseUrl + '/QuoteMachinery/', message);
    },
    saveMachines: function(message) {
      return this.$http.post(this.baseUrl + '/QuoteMachinery/Save', message);
    },
    getQuoteMaterials: function(quoteCategoryId) {
      return this.$http.get(this.baseUrl + '/QuoteMaterial/' + quoteCategoryId);
    },
    saveMaterials: function(message) {
      return this.$http.post(this.baseUrl + '/QuoteMaterial/Save', message);
    },
    getQuoteTechnicses: function(quoteCategoryGuid) {
      return this.$http.get(this.baseUrl + '/QuoteTechnics/' + quoteCategoryGuid);
    },
    saveTechnicses: function(message) {
      return this.$http.post(this.baseUrl + '/QuoteTechnics/Save', message);
    },
    getProfits: function(quoteCategoryId) {
      return this.$http.get(this.baseUrl + '/QuoteProfit/' + quoteCategoryId);
    },
    saveProfits: function(message) {
      return this.$http.post(this.baseUrl + '/QuoteProfit/Save', message);
    },
    openShop: function(message) {
      return this.$http.post(this.baseUrl + '/Admin/OpenShop', message);
    },
    saveQuoteCategory: function(message) {
      return this.$http.post(this.baseUrl + '/QuoteCategory/SaveQuoteCategory', message);
    },
    saveParts: function(message) {
      return this.$http.post(this.baseUrl + '/QuotePart/Save', message);
    },
    getCompanyInfo: function(companyGuid) {
      return this.$http.get(this.baseUrl + '/Company/GetBasicCompanyInfo/' + companyGuid);
    },
    saveCompanyInfo: function(message) {
      return this.$http.post(this.baseUrl + '/Admin/UpdateContactInfo', message);
    },
    getTimePerformanceStat: function(companyGuid) {
      return this.$http.get(this.baseUrl + '/Admin/GetTimePerformanceStat/' + companyGuid);
    },
    getCategoryPerformanceStat: function(companyGuid, type) {
      return this.$http.get(this.baseUrl + '/Admin/GetCategoryPerformanceStat/' + companyGuid + '/' + type);
    },
    getNews: function(companyGuid) {
      return this.$http.get(this.baseUrl + '/Company/GetCompanyNews/' + companyGuid);
    },
    addNews: function(message) {
      return this.$http.post(this.baseUrl + '/Admin/AddCompanyNews', message);
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
