function searching(client,item,cb)
{
    client.search({
        index: 'way2buzz',
        type: 'company',
        body: {

            size:100,

            sort:["_score"],

            "query": {
                "term": {
                    "cid": item
                }
            }

        }

    }).then(function (resp) {

        cb(resp.hits.hits)

    })
}

module.exports=searching