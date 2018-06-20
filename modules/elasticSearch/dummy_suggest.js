function searching(client,q,cb)
{
			client.search({
			index:'way2buzz_suggestions3_people',
			body:
			{
   				 "suggest": {
   				     "demo" : {
     		         "prefix" : q,
                     "completion" : { 
                           "field" : "suggest"
                        }
             }
    		 }
			}
			}).then(function (resp) {
    					cb(resp);
						}, function (err) {
								    console.trace(err.message);
								});		
}
module.exports=searching;