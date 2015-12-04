var angular = require('angular');

angular.module('logascope')
    .controller('searchBoxController', ['hotkeys', function(hotkeys) {
        // Create local `pageSearch` so we don't have to worry about what
        // `this` binds to in closures.
        var pageSearch = this.pageSearch = {
            caseSensitive: false,
            searchText: '',
            wrap: true
        };

        var createSearchCallback = function (options) {
            options = options || {};
            var backwards = options['backwards'] || false;

            return function (e) {
                if (!pageSearch.searchText) {
                    return;
                }
                var p = pageSearch;
                window.find(p.searchText, p.caseSensitive, backwards, p.wrap);
            };
        };

        this.searchForward = createSearchCallback();
        this.searchBackward = createSearchCallback({backwards: true});

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
            controllerAs: 'ctrl',
            bindToController: true,
            templateUrl: 'components/search-box/index.html'
        };
    }]);
