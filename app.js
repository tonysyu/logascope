/*global angular, require*/

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

        $scope.renderCode = function (code) {
            code = hljs.highlight($scope.selectedLanguage, code).value;
            code = hljs.fixMarkup(code);
            $scope.code.renderedValue = code;
        };
    });
