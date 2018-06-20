function searching(client,Obj,cb)
{
    // console.log(Obj)
    var count=0;
    var arr=[];
    if(Obj.cname!=undefined)
    {
        Obj.name=Obj.cname;
        arr.push("name");

    }
    if(Obj.type!=undefined)
    {
        arr.push("type");
    }
    if(Obj.loc!=undefined)
    {
        arr.push("loc");
    }
    //console.log(arr[0]+" "+Obj[arr[0]]);
    // console.log(Obj)
    var len=arr.length;
    if(len==1)
    {
        key=arr[0];
        value=Obj[arr[0]];
        client.search({
            index:"way2buzz_company",
            type:"company",
            body:
                {
                    size:50,
                    query:{
                        bool:{
                            should:[
                                {"match_phrase":{[key.toString()]:value}}
                            ],
                        }
                    }
                }}).then(function (resp){
                var hits = resp.hits.hits;
                // console.log(hits);
                cb(hits);
            },
            function (err) {
                console.trace("error"+err.message);
            })

    }
    else if(len==2)
    {
        key1=arr[0];
        key2=arr[1];
        value1=Obj[arr[0]];
        value2=Obj[arr[1]];
        client.search({
            index:"way2buzz_company",
            type:"company",
            body:
                {
                    size:50,
                    query:{
                        bool:{
                            should:[
                                {"match_phrase":{[key1.toString()]:value1}},
                                {"match_phrase":{[key2.toString()]:value2}}
                            ]
                        }
                    }
                }}).then(function (resp){
                var hits = resp.hits.hits;
                cb(hits)
            },
            function (err) {
                console.trace(err.message);
            });

    }
    else
    {
        key1=arr[0];
        key2=arr[1];
        key3=arr[2];
        value1=Obj[arr[0]];
        value2=Obj[arr[1]];
        value3=Obj[arr[2]];
        client.search({
            index:"way2buzz_company",
            type:"company",
            body:
                {
                    size:50,
                    query:{
                        bool:{
                            should:[
                                {"match_phrase":{[key1.toString()]:value1}},
                                {"match_phrase":{[key2.toString()]:value2}},
                                {"match_phrase":{[key3.toString()]:value3}}
                            ]
                        }
                    }
                }}).then(function (resp){
                var hits = resp.hits.hits;
                cb(hits);
            },
            function (err) {
                console.trace(err.message);
            });

    }

}
module.exports=searching;