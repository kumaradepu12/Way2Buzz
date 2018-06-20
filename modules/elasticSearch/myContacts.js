
function searching(client, item, cb) {
    client.search({
        index: 'way2buzz',
        type: 'employee',
        body: {
            sort: ["_score"],
            "query": {
                "term": {
                    "lid.keyword": {
                        "value": item
                    }
                }
            }
        }
    }).then(function (resp) {
        cb(resp.hits.hits)
    })
}
module.exports=searching