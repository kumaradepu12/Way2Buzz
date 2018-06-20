function searching(client,q,cb)
{
			client.search({
			index:'way2buzz',
			body:
			{
				query:{
					simple_query_string:{
							query:q,
							fields:["name^10","prfsn^8","loc^6","type^5"]
						     }
				      }
			}
			}).then(function (resp) {
				cb(resp.hits.hits)
						}, function (err) {
								    console.trace(err.message);
								});		
}
module.exports=searching;