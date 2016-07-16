export default class httpService {
	
	constructor($http, baseUrl) {
	    this.$http = $http;
	    this.baseTokenUrl = baseUrl;
		this.baseUrl = baseUrl + '/api';
	}

	getQuotationResult(items) {
	    return this.$http.post(this.baseUrl + '/generic/', items);
	}
	
	getBindingInfo(qcId) {
	    return this.$http.get(this.baseUrl + '/QuoteCategoryBasicBindingInfo/'+ qcId);
    }
	
    getMenuItems(id) {
        return this.$http.get(this.baseUrl + '/Menu/' + id);
    }

    registerAccount(info) {
        return this.$http.post(this.baseUrl + '/account/Register', info);
    }
		
    requestAccessToken(loginInfo) {
        // return this.$http.post(this.baseTokenUrl + '/Token', loginInfo,  {headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
        return this.$http({
            method: 'POST',
            url: this.baseTokenUrl + '/Token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function(obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: loginInfo
        });
    }

}

httpService.$inject = ['$http', 'baseUrl'];

