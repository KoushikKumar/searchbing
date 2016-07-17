'use strict';

var apiUrl = "http://searchbing-koushikkumarv.c9users.io";
var numberOfClicks = 1;

function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
}
    
$(".latestSearches").css("display","none");
$(".searchBox").keypress(function(e) {
    if (e.which == 13) {
        setTimeout(function(){
            $("#pagenationBlock").empty();
            $("#pagenationBlock").append('<a><i class="fa fa-angle-left fa-2x" aria-hidden="true"></i></a><a><i class="fa fa-angle-right fa-2x" aria-hidden="true"></i></a>');
        },1500);
        retreiveResults();
    }
});

$('#pagenationBlock').on("click",".fa-angle-right",function(){
      numberOfClicks = numberOfClicks + 1;
      enablePreviousButton();
      retreiveResults();
});

$('#pagenationBlock').on("click",".fa-angle-left",function(){
      if(numberOfClicks>1){
          numberOfClicks = numberOfClicks - 1;
          if(numberOfClicks==1){
              disablePreviousButton();
          }else{
              enablePreviousButton();
          }
          retreiveResults();
      }else{
          disablePreviousButton();
      }
});

function retreiveResults(){
      $("body").css("background-color","rgba(0,0,0,.05)");    
      $(".panel").css("background-color","rgba(0,0,0,.03)"); 
      var inputQuery = $(".searchBox").val();
      if(inputQuery.length >0){
              $(".searchBox").addClass("moveSearchBox");
              ajaxRequest('GET',apiUrl+"/search/query/"+inputQuery+"?offset="+numberOfClicks,function(data){
                $("body").css("background-color","rgba(0,0,0,0)"); 
                $(".panel").css("background-color","rgba(0,0,0,0)");
                $(".feed").empty();
               
                $.parseJSON(data).forEach(function(result){
                    var imageUrl = result.thumbnail;
                    var title = result.snippet;
                    var source = result.content;
                    
                    $(".feed").append('<div class="panel panel-default panelFeed"><div class="panel-body"><div class="row"><div class="col-xs-1"><a href="#" data-toggle="tooltip" data-placement="right" title="<img id=\'hoverImage\' src=\''+imageUrl+'\'/>"><img src=\''+imageUrl+'\' width="60px" height="60px" /></a></div><div class="col-xs-11"><p class="title"><span class="sideHeaders">Title:</span>'+skimString(title,100)+'</p><p class="imageUrl"><span class="sideHeaders">Image Url:</span><a target="blank" href="'+imageUrl+'">'+skimString(imageUrl,100)+'</a></p><p class="sourceUrl"><span class="sideHeaders">Source Url:</span><a target="blank" href="'+source+'">'+skimString(source,100)+'</a></p></div></div></div></div>');
                
                    $('[data-toggle="tooltip"]').tooltip({
                        animated: 'fade',
                        html: true
                    });
                });
              });
              
              ajaxRequest('GET',apiUrl+"/search/recent",function(data){
                   $(".latestSearches").css("display","block");
                   $(".latestSearchResults").empty();
                   var resultSet = new Set();
                   $.parseJSON(data).forEach(function(result){
                       resultSet.add(result.term);
                   });
                   if(resultSet.has(inputQuery)){
                       resultSet.delete(inputQuery);
                   }
                   for(let result of resultSet){
                       $(".latestSearchResults").append('<li><a>'+skimString(result,23)+'</a></li>');
                       $("li").last().on("click",function(){
                           $(".searchBox").val(result);
                           retreiveResults();
                       });
                   }
              });
      }else{
          $("#pagenationBlock").empty();
      }
}

function disablePreviousButton(){
    $(".fa-angle-left").css("cursor","default");
    $(".fa-angle-left").css("color","#ffffff");
}

function enablePreviousButton(){
    $(".fa-angle-left").css("cursor","pointer");
    $(".fa-angle-left").css("color","#23527c");
}

function skimString(input,desiredLength){
    if(String(input).length>desiredLength){
        var output = String(input).substring(0,desiredLength);
        output = output+'...';
        return output;
    }
    return input;
}