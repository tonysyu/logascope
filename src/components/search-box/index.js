var angular = require('angular');

angular.module('logascope')
    .controller('searchBoxController', ['$scope', 'hotkeys', function($scope, hotkeys) {
        $scope.pageSearch = {
            caseSensitive: false,
            searchText: '',
            wrap: true
        };

        var createSearchCallback = function (options) {
            options = options || {};
            var backwards = options['backwards'] || false;

            return function (e) {
                if (!$scope.pageSearch.searchText) {
                    return;
                }
                var p = $scope.pageSearch;
                window.find(p.searchText, p.caseSensitive, backwards, p.wrap);
            };
        };

        hotkeys.add({
            combo: 'ctrl+f',
            callback: createSearchCallback()
        });

        hotkeys.add({
            combo: 'ctrl+shift+f',
            callback: createSearchCallback({backwards: true})
        });
    }])
    .directive("searchBox", [function () {
        return {
            controller: 'searchBoxController',
            templateUrl: 'components/search-box/index.html'
        };
    }]);
