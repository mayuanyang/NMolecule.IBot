"use strict";
var homeLayoutController = function() {
  function homeLayoutController($http, $stateParams, $filter, httpService, $interval) {
    var $__5 = this;
    this.$http = $http;
    this.$interval = $interval;
    this.$http.defaults.headers.common.Authorization = 'BotConnector kaPcdAksQ_M.cwA.jQk.K-BStvNcDBLqbWrjRLGoo4pvsn1hlmpyO6PfxunmPY8';
    this.message = '';
    this.showDemoData();
    this.getRequestToken().success(function(data) {
      $__5.token = data;
    });
    this.startConversation().success(function(data) {
      $__5.conversationId = data.conversationId;
      $__5.getMessages();
    });
  }
  return ($traceurRuntime.createClass)(homeLayoutController, {
    getRequestToken: function() {
      return this.$http.get('https://directline.botframework.com/api/tokens');
    },
    startConversation: function() {
      return this.$http.post('https://directline.botframework.com/api/conversations', '');
    },
    postMessage: function() {
      return this.$http({
        method: 'POST',
        url: 'https://directline.botframework.com/api/conversations/' + this.conversationId + '/messages',
        data: {message: {
            "id": "string",
            "conversationId": this.conversationId,
            "created": "2016-07-17T11:02:01.374Z",
            "from": "test",
            "text": "get account for 46012345678",
            "channelData": {},
            "images": [],
            "attachments": [],
            "eTag": ""
          }}
      });
    },
    getMessages: function() {
      var self = this;
      var var_1 = this.$interval(function() {
        self.$http.get('https://directline.botframework.com/api/conversations/' + self.conversationId + '/messages').success(function(data) {
          console.log(data);
        });
      }, 5000);
    },
    showDemoData: function() {
      this.models = [];
      var dynamicContent = {
        data: {
          "name String": "eddy",
          "gender String": "male",
          "age String": "35",
          "thing Object": {
            "firstName": "yuan",
            "lastName": "ma"
          },
          "array Only": ["aa", "bb", "cc"],
          "schema": [{
            "data_type": "string",
            "display_name": "MyField123"
          }, {
            "data_type": "file",
            "display_name": "MyField456"
          }, {
            "data_type": "checkbox",
            "display_name": "MyField789"
          }]
        },
        name: "test"
      };
      var listData = {
        data: ['aaa', 'bbb'],
        name: "list data"
      };
      this.models.push(dynamicContent);
      this.models.push(listData);
    }
  }, {});
}();
var $__default = homeLayoutController;
;
homeLayoutController.$inject = ['$http', '$stateParams', '$filter', 'httpService', '$interval'];
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=homeLayoutController.js.map
