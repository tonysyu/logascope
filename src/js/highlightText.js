/*global require*/

var angular = require('angular');
var hljs = require('highlight.js');


angular.module('logascope')
    .factory('highlightText', function () {

        hljs.registerLanguage(
            'example-log',
            require('./languages/example-log.js')
        );

        hljs.configure({ useBR: true });

        return {
            availableLanguages: hljs.listLanguages(),
            render: function (selectedLanguage, text) {
                text = hljs.highlight(selectedLanguage, text).value;
                return hljs.fixMarkup(text);
            }
        };
    });
