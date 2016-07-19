
export default class homeLayoutController{
    constructor($http, $stateParams, $filter, httpService, $interval) {
        this.$http = $http;
		this.$interval = $interval;
		this.$http.defaults.headers.common.Authorization = 'BotConnector kaPcdAksQ_M.cwA.jQk.K-BStvNcDBLqbWrjRLGoo4pvsn1hlmpyO6PfxunmPY8' ;
        this.message = '';
        this.messages = [];
        this.models = [];
        //this.showDemoData();

        this.getRequestToken()
            .success(data => {
                //console.log(data);
                this.token = data;
            });

        this.startConversation()
            .success(data => {
                this.conversationId = data.conversationId;
                this.getMessages();
            });
		
		
    }
	
    getRequestToken() {
             return this.$http.get('https://directline.botframework.com/api/tokens');
    }

    startConversation() {
        return this.$http.post('https://directline.botframework.com/api/conversations', '');
    }

    postMessage() {
        this.$http({
            method: 'POST',
            url: 'https://directline.botframework.com/api/conversations/'+ this.conversationId + '/messages',
            
            data: { message: {
                "id": "string",
                "conversationId": this.conversationId,
                "created": "2016-07-17T11:02:01.374Z",
                "from": "test",
                "text": this.message,
                "channelData": {},
                "images": [],
                "attachments": [],
                "eTag": ""
            } }
        }).success(data => {
            this.message = '';
        });
    }

    getMessages() {
		var self = this;
		var var_1=this.$interval(function() {
		    self.$http.get('https://directline.botframework.com/api/conversations/' + self.conversationId + '/messages')
		        .success(data => {
		            for (var i in data.messages) {
		                var msg = data[i];
		                if (msg) {
		                    self.messages.push(msg.text);
		                    var result = {
		                        data: msg,
		                        name: msg.text
		                    };
		                    self.models.push(result);
		                }
		            }


		        });
		},5000);
    }

    showDemoData() {
		
		
        var dynamicContent = {
			data: {
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
	
	
};

homeLayoutController.$inject = ['$http', '$stateParams', '$filter', 'httpService', '$interval'];