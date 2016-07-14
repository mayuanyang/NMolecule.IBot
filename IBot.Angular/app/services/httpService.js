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

    getUserInfo() {
        return this.$http.get(this.baseUrl + "/Account/UserInfo");
        
    }

    getAllQuoteCategories(companyId) {
        return this.$http.get(this.baseUrl + '/QuoteCategory/'+ companyId);
    }

    getAllParts(qcid) {
        return this.$http.get(this.baseUrl + '/QuotePart/'+ qcid);
    }

    turnOnOffQuoteCategory(message) {
        return this.$http.post(this.baseUrl + '/QuoteCategory/TurnOnOff', message);
        
    }

    getQuoteMachineries(quoteCategoryId) {
        return this.$http.get(this.baseUrl + '/QuoteMachinery/'+ quoteCategoryId);
    }

    turnOnOffQuoteMachinery(message) {
        return this.$http.post(this.baseUrl + '/QuoteMachinery/', message);
    }

    saveMachines(message) {
        return this.$http.post(this.baseUrl + '/QuoteMachinery/Save', message);
    }

    getQuoteMaterials(quoteCategoryId) {
        return this.$http.get(this.baseUrl + '/QuoteMaterial/'+ quoteCategoryId);
    }

    saveMaterials(message) {
        return this.$http.post(this.baseUrl + '/QuoteMaterial/Save', message);
    }

    getQuoteTechnicses(quoteCategoryGuid) {
        return this.$http.get(this.baseUrl + '/QuoteTechnics/'+ quoteCategoryGuid);
    }

    saveTechnicses(message) {
        return this.$http.post(this.baseUrl + '/QuoteTechnics/Save', message);
    }

    getProfits(quoteCategoryId) {
        return this.$http.get(this.baseUrl + '/QuoteProfit/'+ quoteCategoryId);
    }

    saveProfits(message) {
        return this.$http.post(this.baseUrl + '/QuoteProfit/Save', message);
    }

    openShop(message) {
        return this.$http.post(this.baseUrl + '/Admin/OpenShop', message);
    }

    saveQuoteCategory(message) {
        return this.$http.post(this.baseUrl + '/QuoteCategory/SaveQuoteCategory', message);
    }

    saveParts(message) {
        return this.$http.post(this.baseUrl + '/QuotePart/Save', message);
    }

    getCompanyInfo(companyGuid) {
        return this.$http.get(this.baseUrl + '/Company/GetBasicCompanyInfo/'+ companyGuid);
    }
    saveCompanyInfo(message) {
        return this.$http.post(this.baseUrl + '/Admin/UpdateContactInfo', message);
    }

    getTimePerformanceStat(companyGuid) {
        return this.$http.get(this.baseUrl + '/Admin/GetTimePerformanceStat/'+ companyGuid);
    }

    getCategoryPerformanceStat(companyGuid, type) {
        return this.$http.get(this.baseUrl + '/Admin/GetCategoryPerformanceStat/'+ companyGuid + '/' + type);
    }

    getNews(companyGuid) {
        return this.$http.get(this.baseUrl + '/Company/GetCompanyNews/'+ companyGuid );
    }

    addNews(message) {
        return this.$http.post(this.baseUrl + '/Admin/AddCompanyNews', message);
    }

}

httpService.$inject = ['$http', 'baseUrl'];

