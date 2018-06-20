function suggestions(client,q, index,cb )
{
	index=index.toLowerCase();

			var n=3;
			if ( index[0] =='c' ){
				n = 4;
			}
			// console.log(n);
			client.search({
			index:'way2buzz_suggestions'+3+"_"+index,
			body:
			{

   				 "suggest": {
   				     "demo" : {
     		         "prefix" : q,
                     "completion" : { 
                           "field" : "suggest",
                           "size":20
                        }
             }
     }
			}
			}).then(function (resp) {
				// console.log(resp.suggest);
    					cb(resp);
						}, function (err) {
								    console.trace(err.message);
								});		
}
module.exports=suggestions;
