/*global angular, require*/

var fs = require('fs');
var angular = require('angular');
var sanitize = require('angular-sanitize');
var hljs = require('highlight.js');

angular.module("demo", ["ngSanitize"])
    .controller("SimpleDemoController", function ($scope) {
        "use strict";

        hljs.registerLanguage(
            'example-log',
            require('./languages/example-log.js')
        );

        hljs.configure({ useBR: true });

        $scope.code = {value: '', renderedValue: ''};

        $scope.availableLanguages = hljs.listLanguages();
        $scope.selectedLanguage = 'example-log';

        $scope.availableFileModes = ['load'];
        $scope.fileMode = 'load';

        $scope.watchFile = function (file) {
            if ($scope.fileMode) {
                var text = fs.readFileSync(file.path, 'utf8');
                $scope.code.value = text;
                $scope.code.renderedValue = $scope.renderCode(text);
            }
        };

        $scope.renderCode = function (text) {
            text = hljs.highlight($scope.selectedLanguage, text).value;
            return hljs.fixMarkup(text);
        };
    })
    .directive("watchFile", [function () {
        "use strict";

        return {
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var file = changeEvent.target.files[0];
                    // Use $apply since we're reacting to an event.
                    scope.$apply(function () {
                        scope.watchFile(file);
                    });

                });
            }
        };
    }]);
