
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
		
        return this.$http.post('https://directline.botframework.com/api/conversations');
    }

    postMessage() {
        this.$http({
            method: 'POST',
            url: 'https://directline.botframework.com/api/conversations/'+ this.conversationId + '/messages',
            
            data: { 
                "text": this.message
            } 
        }).success(data => {
            this.message = '';
        });
    }

    getMessages() {
		var self = this;
		var var_1=this.$interval(function() {
		    self.$http.get('https://directline.botframework.com/api/conversations/' + self.conversationId + '/messages')
		        .success(data => {
		            for(var i in data.messages) {
		                console.log(i);
		                var msg = data.messages[i];
		                console.log(msg);
		                if (msg) {
		                    self.messages.push(msg.text);
		                    var result = {
		                        data: msg.attachments[0],
		                        name: msg.text
		                    };
		                    self.models.push(result);
		                    console.log('message added');
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