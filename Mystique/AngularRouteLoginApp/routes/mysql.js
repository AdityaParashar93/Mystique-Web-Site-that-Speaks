var ejs= require('ejs');
var mysql = require('mysql');

var pool = mysql.createPool({
	
	connectionLimit : 500,
	host     		: 'localhost',
    user     		: 'root',
    password 		: 'root',
    database 		: 'eBay',
    debug    		:  false,
    port	 		:	3306
	
});
function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	
	pool.getConnection(function(err,connection){
		connection.query(sqlQuery, function(err, rows, fields) {
			if(err){
				console.log("ERROR: " + err.message);
			}
			else 
			{	// return err or result
				console.log("DB Results:"+rows);
				callback(err, rows);
			}
		});
		console.log("\nConnection Released..");
		connection.release();
	});
}	

exports.fetchData=fetchData;





