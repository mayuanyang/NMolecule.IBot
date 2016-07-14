import angular from 'angular';
angular.module('dynamicTemplateDirective',[]).directive('dynamicTemplate', ['$compile', function($compile){
    var directive = {};
    directive.restrict = 'E';
    directive.scope = { data: '=data', name: '@name' };
		
	directive.link = function (scope, elm, attrs) {
      
      var field_inputs = "";
	  var myData = scope.data;
	  var headerName = scope.name;
	  console.log(headerName);
	  	  var new_field ='';
	  var panelOpenTag = " <div class='panel panel-primary' class='expandable'><div class='panel-heading'>" + scope.name + "</div><div class='panel-body'>";
	  var panelCloseTag = "</div></div></div>";
	  
	  function walk(obj, isInner) {
		  for (var field in obj) {
			  if (obj.hasOwnProperty(field)) {
				  var val = obj[field];
				  if(Object.prototype.toString.call(obj[field]) === '[object Array]'){
					 new_field += "<div><strong><p class='text-capitalize'>" + field + "</p></strong></div>"
						  var list = obj[field];
						  var tableHeader = "<table class='table table-bordered'>";
						  var tableFooter = "</table>";
						  var headerRowOpen = "<tr>";
						  var headerRowClose = "</tr>";
						  var headerContent ="";
						  var contentRow = "";
						  var rows = "";
						  
						  var loop = 0;
						  for(var item in list){
							  //headerContent += "<th>" + item + "</th>";
							  
							  if(Object.prototype.toString.call(list[item]) === '[object Object]'){
								  walk(list[item], true);
								  var objItem = list[item];
								  contentRow = "<tr>" + contentRow;
								  for(var f in objItem){
									  console.log("inner table " + f);
									  if(loop === 0)
										headerContent += "<th class='text-capitalize'>" + f + "</th>";
									  contentRow +=  "<td>" + objItem[f] + "</td>";	
								  }
								  contentRow = contentRow + "</tr>";
							  }
							  else{
								  headerContent = "<th>Content</th>"
								  contentRow += "<tr><td>" + list[item] + "</td></tr>";					  
							  }
							  loop++;
						  } 
						  //console.log(contentRow);
						  var table = tableHeader + headerRowOpen + headerContent + headerRowClose + contentRow + tableFooter;
						  //console.log(table);
						  new_field += table;
						  
				  }else if(Object.prototype.toString.call(obj[field]) === '[object Object]'){
					  //new_field = panelOpenTag + new_field;
					  walk(val, true);
					  //new_field = new_field + panelCloseTag;
				  }else{
					  if(isInner){
						  
					  }else{
						  new_field += "<div><strong><p class='text-capitalize'>" + field + ":</p></strong>" + obj[field] + "</div>";
					  }
					  
				  }
			  
			}
		  }
		}
		new_field = panelOpenTag + new_field;
		walk(myData, false);
		new_field = new_field + panelCloseTag;
	  /*
      for (var field in obj){
		  
		  if(obj.hasOwnProperty(field)){
			  var new_field ='';
			  
			  if(Object.prototype.toString.call(obj[field]) === '[object Array]'){
				  
					  console.log(field + obj[field]);
					  new_field += "<div>" + field + "</div>"
					  var list = obj[field];
					  for(var item in list){
						  new_field += "<div>" + list[item] + "</div>"
					  }
					  			  
				  
			  }else{
				  console.log(Object.prototype.toString.call(obj[field]));
				  new_field = "<div><span>" + field +"</span>: <span>" + obj[field] + "</span></div>";
				  
			  }
			
			field_inputs += new_field;  
		  }
		  
		
        var new_field = "";
        var field_type = schema[field].data_type == "boolean" ? "checkbox" : schema[field].data_type;

        switch (field_type){
          case 'file':
            new_field = "<div>" + schema[field].display_name + ":<input type='file' ng-model='" + field_type + "' id='fileToUpload' class='file-field' /></div>";
            break;
          default:
            new_field = "<div>" + schema[field].display_name + ":<input type='" + field_type + "' ng-model='" + field_type + "'/></div>";
        }

        field_inputs = field_inputs + new_field;
		*/
      
      elm.append($compile(new_field)(scope));
    };

    
    return directive;
}]);