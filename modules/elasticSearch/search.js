function searching(client,q,index,cb) {
// console.log(q,index)
    if (index == 1) {
        client.search({
            index: "way2buzz_company",
            type: "company",
            body:
                {
                    size:50,
                    query: {
                        simple_query_string: {
                            query: q,
                            fields: ["name^10", "type^8", "loc^6"]
                        }
                    }
                }
        }).then(function (resp) {
                cb(resp.hits.hits);
            },
            function (err) {
                console.trace(err.message);
            })
    }

    if(index==2) {

        client.search({
            index: "employee",
            type: "people",
            body:
                {
                    size:50,
                    query: {
                        simple_query_string: {
                            query: q,
                            fields: ["ename^10", "prfsn^8", "cname^6", "loc^4"]
                        }
                    }
                }
        }).then(function (resp) {
            // console.log(resp.hits.hits);
                cb(resp.hits.hits);
            },
            function (err) {
                console.trace(err.message);
            });
    }
}
module.exports=searching