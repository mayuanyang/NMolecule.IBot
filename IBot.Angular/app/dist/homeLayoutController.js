"use strict";
var homeLayoutController = function() {
  function homeLayoutController($http, $stateParams, $filter, httpService, $interval) {
    var $__3 = this;
    this.$http = $http;
    this.$interval = $interval;
    this.$http.defaults.headers.common.Authorization = 'BotConnector kaPcdAksQ_M.cwA.jQk.K-BStvNcDBLqbWrjRLGoo4pvsn1hlmpyO6PfxunmPY8';
    this.message = '';
    this.messages = [];
    this.models = [];
    this.watermark = 0;
    this.getRequestCounter = 0;
    this.receivedMessageIds = [];
    this.getRequestToken().success(function(data) {
      $__3.token = data;
    });
    this.startConversation().success(function(data) {
      $__3.conversationId = data.conversationId;
      $__3.getMessages();
    });
  }
  return ($traceurRuntime.createClass)(homeLayoutController, {
    getRequestToken: function() {
      return this.$http.get('https://directline.botframework.com/api/tokens');
    },
    startConversation: function() {
      return this.$http.post('https://directline.botframework.com/api/conversations');
    },
    postMessage: function() {
      var $__3 = this;
      this.$http({
        method: 'POST',
        url: 'https://directline.botframework.com/api/conversations/' + this.conversationId + '/messages',
        data: {"text": this.message}
      }).success(function(data) {
        $__3.message = '';
        $__3.getRequestCounter = 0;
      });
    },
    getMessages: function() {
      var self = this;
      var var_1 = this.$interval(function() {
        self.$http.get('https://directline.botframework.com/api/conversations/' + self.conversationId + '/messages?watermark=' + self.watermark).success(function(data) {
          for (var i in data.messages) {
            console.log(i);
            var msg = data.messages[i];
            if (self.receivedMessageIds.indexOf(msg.id) == -1) {
              self.receivedMessageIds.push(msg.id);
              self.messages.push(msg.text);
              if (msg.channelData) {
                var result = {
                  data: msg.channelData,
                  name: msg.text
                };
                self.models.push(result);
                console.log('message added');
              }
            }
          }
          self.getRequestCounter += 1;
          if (self.getRequestCounter === 10) {
            self.watermark += 1;
            self.getRequestCounter = 0;
          }
        });
      }, 2000);
    },
    showDemoData: function() {
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
