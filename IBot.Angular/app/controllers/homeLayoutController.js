
export default class homeLayoutController{
    constructor($http, $stateParams, $filter, httpService) {
        this.$http = $http;
        this.$http.defaults.headers.common.Authorization = 'BotConnector QY4G9TbtvQk.cwA.v7Q.-usmccAmSfOTnTzmRsYovejZYYkI-dq1tb1Y_wCgFAQ' ;
        this.message = '';
        this.dynamicContent = {
    
            "name String" : "eddy",
            "gender String" : "male",
            "age String" : "35",
            "thing Object" : { "firstName" : "yuan", "lastName" : "ma"},
            "array Only" : ["aa", "bb", "cc"],
            "schema":[
              {"data_type":"string", "display_name":"MyField123"},
              {"data_type":"file", "display_name":"MyField456"},
              {"data_type":"checkbox", "display_name":"MyField789"}
            ]
        };

        this.showDemoData();

        this.getRequestToken()
            .success(data => {
                //console.log(data);
                this.token = data;
            });

        this.startConversation()
            .success(data => {
                this.conversationId = data.conversationId;
                console.log(data);
            });

    } 
	
    getRequestToken() {
     
        return this.$http.get('https://directline.botframework.com/api/tokens');
    }

    startConversation() {
        return this.$http.post('https://directline.botframework.com/api/conversations', '');
        
    }

    postMessage() {
        //return this.$http.post('https://directline.botframework.com/api/conversations/'+ this.conversationId + '/messages', 'hello');
        return this.$http({
            method: 'POST',
            url: 'https://directline.botframework.com/api/conversations/'+ this.conversationId + '/messages',
            
            data: { message: this.message }
        });
    }

    getMessages() {
        this.$http.get('https://directline.botframework.com/api/conversations/' + this.conversationId + '/messages')
            .success(data => {
                alert(data);
            });

    }

    showDemoData() {
        this.listData = ["aaaa", "bbbb"];
  
        this.botData={
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
            "participants": [
              {
                  "name": "User1",
                  "channelId": "emulator",
                  "address": "User1"
              },
              {
                  "name": "1b3e574b-8aab-437c-a7d9-5f8b52469c02",
                  "channelId": "emulator",
                  "address": "1b3e574b-8aab-437c-a7d9-5f8b52469c02"
              }
            ],
            "totalParticipants": 2,
            "channelMessageId": "3324b56fa694458e950a75e89ef178d1",
            "channelConversationId": "Conv1"
        };
    }
	
	
};

homeLayoutController.$inject = ['$http', '$stateParams', '$filter', 'httpService'];