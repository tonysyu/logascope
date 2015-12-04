/*global require*/
var angular = require('angular');


angular.module('logascope')
    .directive("fileInput", function () {
        "use strict";
        return {
            scope: {
                onFileChange: '='
            },
            link: function (scope, element) {
                element.bind("change", function (changeEvent) {
                    var file = changeEvent.target.files[0];
                    if (file) {
                        // Use $apply since we're reacting to an event.
                        scope.$apply(function () {
                            scope.onFileChange(file.path);
                        });
                    }
                });
            }
        };
    });
