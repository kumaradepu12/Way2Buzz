var app = angular.module('autocomplete', []);

app.directive('autocomplete', function() {
    var index = -1;

    return {

        restrict: 'E',

        scope: {
            search: '=ngModel',
            suggestions: '=data',
            onType: '=onType',
            onSelect: '=onSelect',
            onClick:'=onClick',
            autocompleteRequired: '=',
            noAutoSort: '=noAutoSort'
        },

        controller: ['$scope', function($scope){

            $scope.selectedIndex = -1;

            $scope.initLock = true;

            $scope.setIndex=function (i) {

                setIndex(i)

            }

            setIndex =function (j) {

                $scope.selectedIndex = parseInt(j);

            }

            this.setIndex = function(i){
                $scope.setIndex(i);
                $scope.$apply();
            };

            $scope.getIndex = function(i){

                return $scope.selectedIndex;
            };

            var watching = true;

            $scope.completing = false;

            $scope.$watch('search', function(newValue, oldValue){

                if (oldValue === newValue || (!oldValue && $scope.initLock)) {

                    return;
                }


                if(watching && typeof $scope.search !== 'undefined' && $scope.search !== null) {

                    $scope.completing = true;
                    $scope.searchFilter = $scope.search;
                    $scope.selectedIndex = -1;


                }

                if($scope.onType)
                    $scope.onType($scope.search);
            });

            this.preSelect = function(suggestion){

                watching = false;

                $scope.$apply();
                watching = true;

            };

            $scope.preSelect = this.preSelect;

            this.preSelectOff = function(){
                watching = true;
            };

            $scope.preSelectOff = this.preSelectOff;

            $scope.select = function(suggestion){
                if(suggestion){

                    $scope.search = suggestion;
                    $scope.searchFilter = suggestion;


                    if($scope.onSelect)
                        $scope.onSelect(suggestion);

                    if($scope.onClick)
                        $scope.onClick(suggestion)

                }
                watching = false;
                $scope.completing = false;
                setTimeout(function(){watching = true;},1000);
                $scope.setIndex(-1);
            };

        }],

        link: function(scope, element, attrs){
         //   console.log(scope.noAutoSort)

            setTimeout(function() {
                scope.initLock = false;
                scope.$apply();
            }, 250);

            var attr = '';

            scope.attrs = {
                "placeholder": "start typing...",
                "class": "",
                "id": "",
                "inputclass": "",
                "inputid": ""
            };

            for (var a in attrs) {
                attr = a.replace('attr', '').toLowerCase();

                if (a.indexOf('attr') === 0) {
                    scope.attrs[attr] = attrs[a];
                }
            }

            if (attrs.clickActivation) {
                element[0].onclick = function(e){
                    if(!scope.search){
                        setTimeout(function() {
                            scope.completing = true;
                            scope.$apply();
                        }, 200);
                    }
                };
            }

            var key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};

            document.addEventListener("keydown", function(e){
                var keycode = e.keyCode || e.which;

                switch (keycode){
                    case key.esc:
                        scope.select();
                        scope.setIndex(-1);
                        scope.$apply();
                        e.preventDefault();
                }
            }, true);

            document.addEventListener("blur", function(e){

                setTimeout(function() {
                    scope.select();
                    scope.setIndex(-1);
                    scope.$apply();
                }, 150);
            }, true);

            element[0].addEventListener("keydown",function (e){
                var keycode = e.keyCode || e.which;

                var l = angular.element(this).find('li').length;

                if(!scope.completing || l == 0) return;

                switch (keycode){
                    case key.up:

                        index = scope.getIndex()-1;
                        if(index<-1){
                            index = l-1;
                        } else if (index >= l ){
                            index = -1;
                            scope.setIndex(index);
                            scope.preSelectOff();
                            break;
                        }
                        scope.setIndex(index);

                        if(index!==-1)
                            scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

                        scope.$apply();

                        break;
                    case key.down:
                        index = scope.getIndex()+1;
                        if(index<-1){
                            index = l-1;
                        } else if (index >= l ){
                            index = -1;
                            scope.setIndex(index);
                            scope.preSelectOff();
                            scope.$apply();
                            break;
                        }
                        scope.setIndex(index);

                        if(index!==-1)
                            scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

                        break;
                    case key.left:
                        break;
                    case key.right:
                    case key.enter:

                    case key.tab:

                        index = scope.getIndex();
                        // scope.preSelectOff();
                        if(index !== -1) {
                            scope.select(angular.element(angular.element(this).find('li')[index]).text());
                            if(keycode == key.enter) {
                                e.preventDefault();
                            }
                        } else {
                            if(keycode == key.enter) {
                                scope.select();
                            }
                        }
                         scope.setIndex(-1);
                        scope.$apply();

                        break;
                    case key.esc:
                        // disable suggestions on escape
                        scope.select();
                        scope.setIndex(-1);
                        scope.$apply();
                        e.preventDefault();
                        break;
                    default:
                        return;
                }

            });
        },
        template: '\
        <div  class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}" >\
          <input\
          \
            type="text"\
            ng-model="search"\
            placeholder="{{ attrs.placeholder }}"\
            class="{{ attrs.inputclass }}"\
            tabindex="{{ attrs.tabindex }}"\
            id="{{ attrs.inputid }}"\
            name="{{ attrs.name }}"\
            ng-required="{{ autocompleteRequired }}"/>\
            <div class="inner-div">\
          <ul ng-controller="MyController"  class="list-group" ng-if="!noAutoSort" ng-show="completing && (suggestions).length > 0">\
          <a  href="" style="color:black;border-bottom:none; text-decoration: none"> <b><li   \
              suggestion\
              ng-repeat="suggestion in suggestions  |  limitTo:7  track by $index " \
              index="{{ $index }}"\
              val="{{ suggestion }}"\
              ng-class="{ active: ($index === selectedIndex) }"\
              ng-click="select(suggestion)"\
              ng-bind-html="suggestion | highlight:search"></li></b></a>\
           </ul>\
           <ul ng-controller="MyController" class="list-group" ng-if="noAutoSort" ng-show="completing && (suggestions).length > 0">\
            <a  style="color:black;border-bottom:none;text-decoration: none" href=""> <li   \
              suggestion\
              ng-repeat="suggestion in suggestions  | limitTo:7   track by $index "\
              index="{{ $index }}"\
              val="{{ suggestion }}"\
              ng-class="{ active: ($index === selectedIndex) }"\
              ng-click="select(suggestion)"\
              ng-bind-html="suggestion | highlight:search"></li> </a>\
           </ul>\
           </div>\
        </div>'
    };
});


app.filter('highlight', ['$sce', function ($sce) {
    return function (input, search) {
        if (typeof input === 'function') return '';
        if (search) {
            // console.log(typeof search)

            // var words = '(' +
            //         search.split(/\ /).join('|') + '|' +
            //         search.split(/\ /).join('|') +
            //         ')',
            //     exp = new RegExp(words, 'gi');
            //     // console.log(exp)
            // if (words.length) {
            //     // console.log(words.length)
            //     // console.log(input)
            //     // input = input.replace(exp, "<span class=\"highlight\">$1</span>");
            // }
        }
        return $sce.trustAsHtml(input);
    };
}]);


app.directive('suggestion', function(){
    return {
        restrict: 'A',
        require: '^autocomplete', // ^look for controller on parents element
        link: function(scope, element, attrs, autoCtrl){
            element.bind('mouseenter', function() {
                autoCtrl.preSelect(attrs.val);
                autoCtrl.setIndex(attrs.index);
            });

            element.bind('mouseleave', function() {

                autoCtrl.preSelectOff();

            });
        }
    };
});


