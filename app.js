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

        $scope.availableLanguages = hljs.listLanguages();
        $scope.selectedLanguage = 'example-log';
        $scope.code = {value: '', renderedValue: ''};

        $scope.loadText = function (text) {
            $scope.code.value = text;
            $scope.renderCode(text);
        };

        $scope.renderCode = function (code) {
            code = hljs.highlight($scope.selectedLanguage, code).value;
            code = hljs.fixMarkup(code);
            $scope.code.renderedValue = code;
        };
    })
    .directive("loadText", [function () {
        "use strict";

        return {
            scope: {
                loadText: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var file = changeEvent.target.files[0];
                    fs.readFile(file.path, 'utf8', function (error, text) {
                        if (error) {
                            throw error;
                        }
                        // Use $apply since file reading is asynchronous.
                        scope.$apply(function () {
                            scope.loadText(text);
                        });
                    });
                });
            }
        };
    }]);
