"use strict";
var homeLayoutController = function() {
  function homeLayoutController($http, $stateParams, $filter, httpService) {
    var $__3 = this;
    this.$http = $http;
    this.$http.defaults.headers.common.Authorization = 'BotConnector QY4G9TbtvQk.cwA.v7Q.-usmccAmSfOTnTzmRsYovejZYYkI-dq1tb1Y_wCgFAQ';
    this.message = '';
    this.dynamicContent = {
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
    };
    this.showDemoData();
    this.getRequestToken().success(function(data) {
      $__3.token = data;
    });
    this.startConversation().success(function(data) {
      $__3.conversationId = data.conversationId;
      console.log(data);
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
        data: {message: this.message}
      });
    },
    getMessages: function() {
      this.$http.get('https://directline.botframework.com/api/conversations/' + this.conversationId + '/messages').success(function(data) {
        alert(data);
      });
    },
    showDemoData: function() {
      this.listData = ["aaaa", "bbbb"];
      this.botData = {
        "conversationId": "8a684db8",
        "language": "en-US",
        "text": "The intent is GetPayments and entity is 46012345678",
        "from": {
          "name": "1b3e574b-8aab-437c-a7d9-5f8b52469c02",
          "channelId": "emulator",
          "address": "1b3e574b-8aab-437c-a7d9-5f8b52469c02",
          "isBot": true
        },
        "to": {
          "name": "User1",
          "channelId": "emulator",
          "address": "User1",
          "isBot": false
        },
        "replyToMessageId": "707b21130a8b4efc8ac5ecebbd2c7e9a",
        "participants": [{
          "name": "User1",
          "channelId": "emulator",
          "address": "User1"
        }, {
          "name": "1b3e574b-8aab-437c-a7d9-5f8b52469c02",
          "channelId": "emulator",
          "address": "1b3e574b-8aab-437c-a7d9-5f8b52469c02"
        }],
        "totalParticipants": 2,
        "channelMessageId": "3324b56fa694458e950a75e89ef178d1",
        "channelConversationId": "Conv1"
      };
    }
  }, {});
}();
var $__default = homeLayoutController;
;
homeLayoutController.$inject = ['$http', '$stateParams', '$filter', 'httpService'];
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});

//# sourceMappingURL=homeLayoutController.js.map
