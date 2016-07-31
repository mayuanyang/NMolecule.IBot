
export default class homeLayoutController{
    constructor($http, $stateParams, $filter, httpService, $interval, $timeout, $scope) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$http = $http;
        this.$interval = $interval;
        this.$http.defaults.headers.common.Authorization = 'BotConnector kaPcdAksQ_M.cwA.jQk.K-BStvNcDBLqbWrjRLGoo4pvsn1hlmpyO6PfxunmPY8' ;
        this.message = '';
        this.messages = [];
        this.models = [];
        this.watermark = 0;
        this.getRequestCounter = 0;
        this.botName = 'd5d2748d-ea5c-4cec-8cc3-1c3fcf8ba2fd';
        this.receivedMessageIds = [];
        this.isRetrivalStart = false;
        //this.showDemoData();

        this.client = null;
        this.request = null;
        this.useMic = true;
        this.luisConfig = null;
        this.oxfordKey = 'fb98374f53e0496f9c3af0804079a848';
        this.language = 'en-us';

        this.getRequestToken()
            .success(data => {
                //console.log(data);
                this.token = data;
            });

        this.startConversation()
            .success(data => {
                this.conversationId = data.conversationId;
                //this.getMessages();
            });
		
		
    }
	
    getRequestToken() {
		
        return this.$http.get('https://directline.botframework.com/api/tokens');
    }

    startConversation() {
		
        return this.$http.post('https://directline.botframework.com/api/conversations');
    }

    postMessage() {
        this.loading = true;
        this.$http({
            method: 'POST',
            url: 'https://directline.botframework.com/api/conversations/'+ this.conversationId + '/messages',
            
            data: { 
                "text": this.message
            } 
        }).then(data => {
            this.loading = false;
            this.getRequestCounter = 0;
            if (!this.isRetrivalStart) {
                this.getMessages();
            }
        });
        this.message = '';
    }

    getMessages() {
        var self = this;
        var var_1=this.$interval(function() {
            self.$http.get('https://directline.botframework.com/api/conversations/' + self.conversationId + '/messages?watermark=' + self.watermark)
		        .success(data => {
		            for(var i in data.messages) {
		                var msg = data.messages[i];
		                //console.log(msg);
		                if (self.receivedMessageIds.indexOf(msg.id) == -1) {
		                    self.receivedMessageIds.push(msg.id);
                            
		                    self.messages.push(msg);
		                    if (msg.channelData) {

		                        var result = {
		                            data: msg.channelData,
		                            name: msg.text
		                        };
		                        self.models.push(result);
		                        //console.log('message added');
		                    }
		                } else {
		                    //console.log('Already handled: ' + msg.id);
		                }
		                
		            }
		            self.getRequestCounter += 1;
		            if (self.getRequestCounter === 10) {
		                self.getRequestCounter = 0;
		            }
		            
		        });
        },2000);
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
	

    start() {
        this.listening = true;
        var current = this;
        var mode = Microsoft.ProjectOxford.SpeechRecognition.SpeechRecognitionMode.shortPhrase;
        
        if (this.useMic) {
            
            client = Microsoft.ProjectOxford.SpeechRecognition.SpeechRecognitionServiceFactory.createMicrophoneClient(
                mode,
                this.language,
                this.oxfordKey,
                this.oxfordKey);
            
            client.startMicAndRecognition();
            var timeoutFunction = function() {
                console.log('done');
                current.message = 'Finish recording';
                client.endMicAndRecognition();
            };
            this.$timeout(timeoutFunction, 5000);
        }

        client.onPartialResponseReceived = function (response) {
            console.log(' client.onPartialResponseReceived');
            current.message += response;
        }

        var fn = function(response) {
            current.listening = false;
            console.log(' client.onFinalResponseReceived');
            console.log(current);
            console.log(response[0].display);
            current.message += (response[0].display);
            current.$scope.$apply(function() {
                current.message = 'hello world';
            });
        };

        client.onFinalResponseReceived = fn;

        client.onIntentReceived = function (response) {
            current.message += response;
        };
    }

    
};

homeLayoutController.$inject = ['$http', '$stateParams', '$filter', 'httpService', '$interval', '$timeout', '$scope'];