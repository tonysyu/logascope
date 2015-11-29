/*global angular, require*/

var angular = require('angular');
var fs = require('fs');
var hljs = require('highlight.js');
var sanitize = require('angular-sanitize');
var hotkeys = require('angular-hotkeys');
var Tail = require('tail').Tail;


angular.module('demo', ['ngSanitize', 'cfp.hotkeys'])
    .controller('SimpleDemoController', function ($scope, hotkeys) {
        'use strict';

        var activeTail, watchedFile,
            noFileMessage = "Select a file to watch";

        $scope.fileInfo = noFileMessage;

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


        function loadCodeFromFile(filePath) {
            var text = fs.readFileSync(filePath, 'utf8');
            $scope.code.value = text;
            $scope.code.renderedValue = $scope.renderCode(text);
        }

        function tailCodeFromFile(filePath) {
            $scope.code.value = 'Start watching: ' + filePath + '\n';
            $scope.code.renderedValue = $scope.code.value;

            activeTail = new Tail(filePath);
            activeTail.on('line', function (text) {
                $scope.code.value += text + '\n';
                $scope.code.renderedValue += $scope.renderCode(text) + '\n';
                $scope.$apply();
            });
        }

        function unwatchTail() {
            if (activeTail) {
                activeTail.unwatch();
                activeTail = null;
            }
        }

        $scope.watchFile = function (filePath) {
            unwatchTail();
            watchedFile = filePath;  // Save file so we can reload if needed.
            $scope.fileInfo = watchedFile + ':';

            if (!filePath) {
                return;
            }

            if ($scope.selectedFileMode === 'load') {
                loadCodeFromFile(filePath);
            } else if ($scope.selectedFileMode === 'tail') {
                tailCodeFromFile(filePath);
            }
        };

        $scope.onFileModeChange = function () {
            if (watchedFile) {
                $scope.watchFile(watchedFile);
            }
        };

        $scope.onLanguageChange = function () {
            $scope.code.renderedValue = $scope.renderCode($scope.code.value);
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
                    if (file) {
                        // Use $apply since we're reacting to an event.
                        scope.$apply(function () {
                            scope.watchFile(file.path);
                        });
                    }
                });
            }
        };
    }]);
