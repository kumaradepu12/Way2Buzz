function searching(client,q,cb)
{
			client.search({
			index:'way2buzz',
			type:'employee',
			body:
			{
				query:{
						match:{
							cid:q
						}
				      }
			}
			}).then(function (resp) {
				cb(resp.hits.hits);
						}, function (err) {
								    console.trace(err.message);
								});		
}
module.exports=searching;