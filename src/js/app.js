/*global require*/

var angular = require('angular');
var fs = require('fs');
var sanitize = require('angular-sanitize');
var hotkeys = require('angular-hotkeys');
var Tail = require('tail').Tail;


angular.module('logascope', ['ngSanitize', 'cfp.hotkeys'])
    .controller('AppController', function ($scope, highlightText) {
        'use strict';

        var activeTail, watchedFile,
            noFileMessage = "Select a file to watch";

        $scope.fileInfo = noFileMessage;

        $scope.code = {value: '', renderedValue: ''};

        $scope.availableLanguages = highlightText.availableLanguages;
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
            return highlightText.render($scope.selectedLanguage, text);
        };
    });
