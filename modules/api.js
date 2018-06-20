var User=require('./user');
var users=null;
var async=require('async')
var config=require('../config');
// var autocomplete=require('./elasticSearch/suggest');
// var company_list=require('./elasticSearch/companies');
var employee_list=require('./elasticSearch/company_employees');
var myCompanies=require('./elasticSearch/myCompanies')
var myContacts=require('./elasticSearch/myContacts')

var searchresult=require('./elasticSearch/search');
var autocompletesearch=require('./elasticSearch/suggestions')
var advcompany=require('./elasticSearch/advcompany');
var advpeople=require('./elasticSearch/advpeople');
User.mongoConnect(
    function (err,db) {
        if(!err)
            users=db.collection("users");
    })

var jwt=require('jsonwebtoken');
var secret="Harry Potter";
var database=null;
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
    hosts: [
        config.elasticsearch.url+':'+config.elasticsearch.port
    ]
});

module.exports=function (router) {

    function verifyToken(req,res,token){
        console.log(req.bo)
        if(!req.headers['x-access-token']){
            res.status(401).send("Unauthorized Request");
        }
        else {
            var token = req.headers['x-access-token'].split(" ")[1];

            console.log(token)
            if (token == "null") {
                res.status(401).send("Unauthorized Request");
            }
            else {
                console.log("jere")
                let payload = jwt.verify(token, 'angular')
                if (payload=="invalid token") {
                    console.log("PAYLOASD")
                    res.status(401).send("Unauthorized Request");
                }
                else {
                    console.log("here")
                    console.log(jwt.decode(token,'angular'))
                    console.log(payload);
                    req.userId = payload.subject;

                }
            }
        }
        next();
    }
    router.use(function (req,res,next) {
        var token=req.headers['x-access-token']
        if (token)
        {
            jwt.verify(token,secret,function (err,decoded) {
                if(err){
                   res.json({success:false, message:"Token Invalid"});
                } else {
                    req.decoded=decoded;
                    next();
                }
            });
        } else {
            res.json({success:false, message:"No token provided"});
        }
    });


    router.post('/me',function (req,res) {
        console.log(res);
        res.send(req.decoded);
    });


    router.post('/suggest_list',function (req,res) {
        // console.log(req.body)
        var companies = ['Tech Mahindra', 'Infosys', 'MicroSoft', 'Amazon', 'Tata Consultancy Services']

        if (req.body.search == ''){
            res.json({list:[]})
        } else {
            autocompletesearch(client,req.body.search,req.body.index,function (resp) {
                // console.log(resp);
                if(resp!=undefined) {
                    var arr = []
                    var data = resp.suggest.demo[0].options

                    for (var i = 0; i < data.length; i++) {
                        arr.push(data[i].text.toLowerCase());
                    }
                    // console.log(arr)
                    res.json({list: arr})
                }
            });
        }
    })

    router.post('/advcompany',function (req,res) {
        advcompany(client,req.body,function (result) {
            res.json({success:true,cmplist:result})

        })

    })
    router.post('/advpeople',function (req,res) {
        advpeople(client,req.body,function (result) {
            res.json({success:true,searchdata:result})

        })

    })
    router.post('/my_Company_list',verifyToken,function (req,res) {
        // console.log(req.body)
        var u_companies=[];
        users.findOne({encEmail:req.body.mail},{MyCompanies:1,_id:0},function (err,companies) {
            if(err)  {
                console.log("in error")
                res.json({cmplist:u_companies})
            }
            else if(companies == null){
                res.json({cmplist: u_companies})
            } else {
                if(companies.MyCompanies)
                companies.MyCompanies.reverse();
                async.eachSeries(companies.MyCompanies,function (item,callback) {

                    myCompanies(client,item,function(result){
                        if(result[0]!=null)
                            u_companies.push(result[0])
                        callback()
                    })

                },function (err) {
                    if(!err) {
                        res.json({cmplist:u_companies})
                    }
                })
            }
        })
    })


    router.post('/my_Contact_list',function (req,res) {
        var u_contacts=[];
        users.findOne({encEmail:req.body.email},{MyContacts:1,_id:0},function (err,contacts) {
            if(err) {
                throw err
            }
            else if(contacts == null){
                    res.json({emplist: u_contacts})

            } else{
                if(contacts.MyContacts)
                contacts.MyContacts.reverse()
                async.eachSeries(contacts.MyContacts, function (item, callback) {
                    myContacts(client, item, function ( result) {
                        if(result[0]!=null)
                        u_contacts.push(result[0])
                        callback()
                    })

                }, function (err) {
                           if(!err) {
                              res.json({emplist:u_contacts})
                           }
                    })
            }
            // }
        })

    })

    router.post('/display_company_result',function (req,res) {
            // console.log(req.body)
        searchresult(client,req.body.Cname,req.body.index, function(resp){
            res.json({success:true,cmplist:resp})
        })
    })

    router.post('/display_employee_result',function (req,res) {
        // console.log(req.body)
        employee_list(client,req.body.cid,req.body.index,function(resp){
            res.json({success:true,searchdata:resp})
        })
    })

    router.post('/display_person_result',function (req,res) {
    // console.log(req.body)
        searchresult(client,req.body.Cname,req.body.index,function(resp){
            res.json({success:true,searchdata:resp})
        })
    })


    router.post('/my_companies_save',function (req,res) {
        // console.log(req.body);
        users.update({encEmail: req.body.email}, {$addToSet: {"MyCompanies": req.body.cid}}, function (err, status) {
            if (!err)
                res.json({success: true, msg: "added to My Companies succesfully"});
            })
    })


    router.post('/my_employee_save',function (req,res) {
        users.update({encEmail: req.body.email}, {$addToSet: {"MyContacts": req.body.lid}}, function (err, status) {
            if (!err)
                res.json({success: true, msg: "added to My Contacts succesfully"});
        })
    })


    router.post('/delete_company',function (req,res) {
        users.update({encEmail:req.body.email}, { $pull : { MyCompanies:req.body.index }},function(err,result) {
            if(!err)
                res.json({success:true})
        })
    })


    router.post('/delete_contact',function (req,res) {
        users.update({encEmail:req.body.email}, { $pull:{ MyContacts:req.body.lid }},function(err,result) {
            if(!err)
                res.json({success:true})
        })
    })

    return router;

};