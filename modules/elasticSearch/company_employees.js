function searching(client,q,index,cb)
{
			client.search({
			index:'way2buzz',
			type:'employee',
			body:
			{
                size:50,
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