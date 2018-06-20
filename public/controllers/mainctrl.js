angular.module('mainController',['authServices','autocomplete','angularUtils.directives.dirPagination'])

.controller('MyController',function (Auth,CompanyRetriever,$routeParams,$rootScope,$scope,$window,$http,$timeout,$location) {
        $scope.companies = CompanyRetriever.getCompanies("...")
        $scope.companies.then(function(data){
             $scope.companies = data;

        });
        $scope.getCompanies = function(){
            return $scope.companies;

        }
        $scope.doSomething = function(typedthings){
            $scope.newCompanies = CompanyRetriever.getCompanies(typedthings,$scope.data.unit);
            $scope.newCompanies.then(function(data){
                $scope.companies = data;
            });

        }

        $scope.doSomething_jt=function (typedthings) {
            $scope.newCompanies = CompanyRetriever.getCompanies(typedthings,"people");
            $scope.newCompanies.then(function(data){
                $scope.companies = data;
            });
        }

        $scope.doSomething_comp=function (typedthings) {
            $scope.newCompanies = CompanyRetriever.getCompanies(typedthings,"people");
            $scope.newCompanies.then(function(data){
                $scope.companies = data;
            });
        }

    $scope.doSomething_industry=function (typedthings) {
        $scope.newCompanies = CompanyRetriever.getCompanies(typedthings,"people");
        $scope.newCompanies.then(function(data){
            $scope.companies = data;
        });
    }
    $scope.doSomething_loc=function (typedthings) {
        $scope.newCompanies = CompanyRetriever.getCompanies(typedthings,"people");
        $scope.newCompanies.then(function(data){
            $scope.companies = data;
        });
    }

        $scope.doSomethingElse = function(suggestion){
            $scope.selector(suggestion,$scope.data.unit)

        }


        var app = $scope;

        app.loadme = false;
        app.classtypes=['blue-border','green-border','grey-border','red-border','orange-border']
        app.len=app.classtypes.length;


    $scope.$on('$routeChangeStart', function(event,next,current) {

        if (Auth.isLoggedIn()) {

                Auth.getUser().then(function (data) {

                    var temp=$location.url();
                    // console.log($location);

                        if (temp.includes('advcompanies')|| temp.includes('advpeople') || temp.includes('personscompany') || temp.includes('persons') || temp.includes('companies') || temp.includes('employee') || temp.includes('mycompanieslist') || temp.includes('mycontactslist')) {

                        // console.log("In router")

                        var ul = $location.url().split("q=")[1];
                            if ($location.url() == '/companies/?q=' + ul) {
                                $scope.display_company_result(ul);
                            }
                            else if ($location.url() == '/employee/?q=' + ul) {
                                $scope.display_employee_result(ul);
                            }
                            else if ($location.url() == '/mycompanieslist/?q=' + ul) {
                              $scope.my_Company_list(ul)
                            }
                            else if ($location.url() == '/mycontactslist/?q=' + ul) {
                                $scope.my_Contact_list(ul)
                            }
                            else if ($location.url() == '/persons/?q=' + ul) {
                                $scope.display_person_result(ul);
                            }
                            else if ($location.url() == '/personscompany/?q=' + ul) {
                                $scope.display_person_companylist_result(ul);
                            }
                            else if($location.url()=='/advcompanies/?q='+ul){
                                $scope.display_advcompany_result(ul);
                            }
                            else if($location.url()=='/advpeople/?q='+ul){
                                $scope.display_advpeople_result(ul);
                            }

                        } else {
                            app.search = "";
                        }

                    app.isLoggedIn = true;

                    app.username = data.data.firstname + " " + data.data.lastname;

                    app.firstname = data.data.firstname;
                    app.desi = data.data.desi;
                    app.email = data.data.email;
                    if (data.data.picture!=null)
                        app.profilepic = data.data.picture;
                    else
                        app.profilepic = 'images/profilepic.png';
                    app.firstname = data.data.firstname;
                    app.lastname = data.data.lastname;
                    app.email = data.data.email;
                    app.loadme = true;

                    if($location.url()=='/')
                        $location.path('/home');
                })

            } else {

                app.isLoggedIn = false;
                app.username = '';
                app.loadme = true;
                // $location.path('/')
            }

            if ($location.hash() == '_=_')

                $location.hash(null);

            // app.doLoginerrorMsg = false;
        });

        $scope.units = [
            {'id': 'people', 'label': 'people'},
            {'id': 'Company', 'label': 'Company'}
        ]
        $scope.data = {
            'id': 1,
            'unit': 'Company'
        }
        $scope.logout = function () {
            Auth.logout();

            $timeout(function () {
                $location.url('/')

            }, 0);

        };

        $scope.linkedIn = function () {
            $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/linkedin';

        };

        $scope.selector=function (search,type) {
            if(type=="Company"){
                $scope.display_company_result(search);
            }
            else {
                // console.log("here")
                $scope.display_person_result(search)
            }
        }

        // $scope.display_company_result = function (search_cname) {
        //
        //
        // }
        $scope.display_company_result = function (cmp) {

            if(cmp.includes('-')){
                cmp=cmp.replace(/-/g,' ');
                // console.log(cmp);
            }
            var search_cname={};
            search_cname.Cname=cmp
            search_cname.index=1;
            var cmpnew=cmp.replace(/\s+/g, '-');
            app.search=cmp;
            Auth.display_company_result(search_cname).then(function (res) {
                app.cmplist = res.cmplist;
                $location.url('/companies/?q='+cmpnew);

            })

        }

        $scope.display_employee_result = function (cmp_cid) {
            // console.log(cmp_cid);
            var search_cid={},cmp={};
            if(angular.isString(cmp_cid)){
                if(cmp_cid)
                search_cid.Cname=cmp_cid.substring(cmp_cid.indexOf('_')+1)
                cmp=cmp_cid.split('_')
                search_cid.cid=parseInt(cmp[0]);
                app.search=search_cid.Cname.replace(/-/g,' ');
            }
            if(angular.isObject(cmp_cid)){
                app.search=cmp_cid.name;
                search_cid.cid=cmp_cid.cid;
                search_cid.Cname=cmp_cid.name.replace(/\s+/g,'-');
            }


            search_cid.index=$scope.data.unit;
            Auth.display_employee_result(search_cid).then(function (res) {
                app.emp_list_length= res.searchdata.length;
                app.emp_res = res.searchdata
                    $location.url('/employee/?q='+search_cid.cid+'_'+search_cid.Cname);
            });
        };

        $scope.display_person_result=function (p_name) {
            if(p_name.includes('-')){
                p_name=p_name.replace(/-/g,' ');
            }
            $scope.data = {
                'id': 2,
                'unit': 'people'
            }
             var search_cname={};
            search_cname.Cname=p_name;
            search_cname.index=2;
            var prsnew=p_name.replace(/\s+/g, '-');
            Auth.display_person_result(search_cname).then(function (response) {
                app.search=p_name;
                app.personlist=response.searchdata;
                $location.url('/persons/?q='+prsnew);
            })
        }
        $scope.display_person_companylist_result=function (prs_cid) {
            $scope.data = {
             'id': 2,
             'unit': 'people'
            }
            var search_cid={},cmp={};
            if(angular.isString(prs_cid)){
                search_cid.Cname=prs_cid.substring(prs_cid.indexOf('_')+1)
                cmp=prs_cid.split('_')
                search_cid.cid=parseInt(cmp[0]);
            }
            if(angular.isObject((prs_cid))){

                search_cid.cid=prs_cid.cid;
                search_cid.Cname=prs_cid.cname.replace(/\s+/g,'-');
            }
            Auth.display_employee_result(search_cid).then(function (res) {
                app.search=search_cid.Cname.replace(/-/g," ");
                app.person_cmplist = res.searchdata
                $location.url('/personscompany/?q='+search_cid.cid+'_'+search_cid.Cname);
            });

        }

        $scope.my_Company_list = function (email) {
            my_Company_list(email)
        };

         var my_Company_list = function (email) {
            var data = {};
            data.mail = email;

            Auth.my_Company_list(data).then(function (response) {
                app.my_Company_list_length=response.cmplist.length;
                app.cmplist = response.cmplist;
                $location.url('/mycompanieslist/?q='+email)
            //
            })
        }

        $scope.advancedSearch=function (jt,cmp,idr,loc) {

             var data={}

            var index=1
            var str=''
            var data={};
            if(jt!=undefined&&jt!=''){
                var index=2
                data.jt=jt
            }
            if(cmp!=undefined && cmp!=''){
                data.cname=cmp

            }
            if(idr!=undefined&&idr!=''){
                data.type=idr
            }
            if(loc!=undefined&&loc!=''){
                data.loc=loc
            }

            if(index==1)
                $scope.display_advcompany_result(data)
            else
                $scope.display_advpeople_result(data)


        }

        // $scope.my_Contact_list = function (email) {
        //     my_Contact_list(email)
        // }
            $scope.display_advcompany_result=function (data) {
                var str=""
                if(angular.isObject(data)) {

                    for (var key in data) {
                        str+=key+":"+data[key].replace(/\s+/g,'-')+"_";

                    }
                    str = str.substring(0, str.length - 1)
                }
                if(angular.isString(data)){
                    var data1={}
                    var ifn=data.split('_')
                    for(var line in ifn){
                        var key=ifn[line].substring(0,ifn[line].indexOf(':'))
                        var value=ifn[line].substring(ifn[line].indexOf(':')+1).replace(/-/,' ');
                        data1[key]=value;

                    }
                    str=data;
                    data=data1;

                }
                $scope.jobtitle=data.jt;
                $scope.company=data.cname;

                $scope.industry=data.type;
                $scope.location=data.loc;

                Auth.display_advcompany_result(data).then(function (res) {
                    app.search="";
                    // console.log(res.cmplist);
                    app.cmplist = res.cmplist;
                    $location.url('/advcompanies/?q='+str);

                })


            }
    $scope.display_advpeople_result=function (data) {
        var str=""
        if(angular.isObject(data)) {

            for (var key in data) {
                str+=key+":"+data[key].replace(/\s+/g,'-')+"_";

            }
            str = str.substring(0, str.length - 1)
        }
        if(angular.isString(data)){
            var data1={}
            var ifn=data.split('_')
            for(var line in ifn){
                var key=ifn[line].substring(0,ifn[line].indexOf(':'))
                var value=ifn[line].substring(ifn[line].indexOf(':')+1).replace(/-/,' ');
                data1[key]=value;

            }
            str=data;
            data=data1;

        }
        $scope.jobtitle=data.jt;
        $scope.company=data.cname;
        $scope.industry=data.type;
        $scope.location=data.loc;
        $scope.data = {
            'id': 2,
            'unit': 'people'
        }

        Auth.display_advpeople_result(data).then(function (res) {
            app.search="";
            app.personlist = res.searchdata;
            $location.url('/advpeople/?q='+str);

        })

    }

        $scope.my_Contact_list=function (email) {
            var data={}
            data.email=email
            Auth.my_Contact_list(data).then(function (response) {
                app.my_Contacts_list_length=response.emplist.length;
                app.emp_res=response.emplist;
                app.my_Contacts_list_length=response.emplist.length;
                $location.url('/mycontactslist/?q='+email)
            })
        }

        $scope.delete_company=function (email,index) {
            var data={}
            data.index=index;
            data.email=email;

            Auth.delete_company(data).then(function(response){
                $scope.my_Company_list(email)
            })
        }

        $scope.delete_contact=function (email,lid) {
            var data={}
            data.lid=lid;
            data.email=email;
            Auth.delete_contact(data).then(function(response){
                $scope.my_Contact_list(email)
            })
        }

        $scope.my_companies_save = function (cid, email) {
            var data={};
            data.cid=cid;
            data.email = email;
            Auth.my_companies_save(data).then(function (res) {
            })
        }


        $scope.my_employee_save = function (data, email) {
            data.email = email;
            Auth.my_employee_save(data).then(function (res) {
            })
        }
    })

    .controller('linkedinCtrl', function ($routeParams, Auth, $location, $window, $scope) {
        var app = this;
        app.errorMsg = false;
        app.disabled = true;
        // console.log($window.location.pathname)

        if ($window.location.pathname == '/linkedinerror') {
            // $scope.alert = 'alert alert-danger';
            // app.errorMsg = 'LinkedIn e-mail not found in database.';
            $location.path('/');
        } else {
            Auth.socialMedia($routeParams.token);
            $location.path('/home');
        }
    })
