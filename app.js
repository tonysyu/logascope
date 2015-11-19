/*global angular, require*/

var angular = require('angular');
var fs = require('fs');
var hljs = require('highlight.js');
var sanitize = require('angular-sanitize');
var Tail = require('tail').Tail;

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

        $scope.availableFileModes = ['load', 'tail'];
        $scope.selectedFileMode = 'tail';

        function loadCodeFromFile(filePath) {
            var text = fs.readFileSync(filePath, 'utf8');
            $scope.code.value = text;
            $scope.code.renderedValue = $scope.renderCode(text);
        }

        function tailCodeFromFile(filePath) {
                $scope.code.value = 'Start watching: ' + filePath + '\n';
                $scope.code.renderedValue = $scope.code.value;

                var tail = new Tail(filePath);
                tail.on('line', function (text) {
                    $scope.code.value += text + '\n';
                    $scope.code.renderedValue += $scope.renderCode(text) + '\n';
                    $scope.$apply();
                });
        }

        $scope.watchFile = function (filePath) {
            if (!filePath) {
                console.log("No file path specified");
                return;
            }

            if ($scope.selectedFileMode === 'load') {
                loadCodeFromFile(filePath);
            } else if ($scope.selectedFileMode === 'tail') {
                tailCodeFromFile(filePath);
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
                        scope.watchFile(file.path);
                    });

                });
            }
        };
    }]);
