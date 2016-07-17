'use strict';

require('dotenv').load();
var Search = require('bing.search');
var search = new Search(process.env.BING_SEARCH_API_KEY);



function searchController(db){
    var searchQuery = db.collection('searchQueries');
    
    this.bingSearch = function(req,res){
        
        var query = req.params.query;
        var offset = req.query.offset;
        var top;
        
        searchQuery.insert({"term":query,"when":(new Date()).toUTCString()},function(err){
            if(err){
                throw err;
            }
        });
        
        
        if(typeof offset == 'undefined'){
            top = 10;
        }else{
            top = 10*offset;
        }
        search.images(query,
        {top: top
        },
        function(err, results) {
            if(err){
                throw err;
            }
            if(results.length>0){
                var offsetResult = results.slice(top-10,top);
                var finalResult =[];
                offsetResult.forEach(function(data){
                    var result ={};
                    result.url = data.url;
                    result.snippet = data.title;
                    result.thumbnail = data.thumbnail["url"];
                    result.content =data.sourceUrl;
                    finalResult.push(result);
                });
                res.send(finalResult);
            }else{
                res.send("<h1>No Results found for "+query+"</h1>");
            }
            
        });
    };
    
    this.getLatestSearches = function(req,res){
        searchQuery.find({},{_id:false}).sort({"when":-1}).limit(10).toArray(function(err,result){
           if(err){
               throw err;
           } 
           res.send(result);
        });
    };
}

module.exports = searchController;