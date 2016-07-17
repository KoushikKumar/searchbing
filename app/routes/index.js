'use strict';

var SearchController = require(process.cwd()+"/app/controllers/searchController.server.js");



module.exports = function(app,db){
    var searchController = new SearchController(db);
    
    app.route('/')
        .get(function(req, res) {
            res.sendFile(process.cwd()+"/public/index.html");
        });
    
    
    app.route('/search/query/:query')
        .get(function(req,res){
            searchController.bingSearch(req,res);
        });
        
    app.route('/search/recent')
        .get(function(req,res){
           searchController.getLatestSearches(req,res);
        });
}; 