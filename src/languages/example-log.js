/*global module*/
/*jslint var: true*/

/*
highlight.js parser for logs with the following form:

    [111:2222]-[01/01/2015 12:00:00 AM] Package.Module.Class.Method: message
        more info
    ...
*/

module.exports = function (hljs) {
    "use strict";

    var MESSAGE = {
        begin: '\\s*\\w',
        end: /([\r\n]\[|\Z)/,  // The start of the next log entry.
        returnEnd: true,
        subLanguage: ['sql', 'javascript']
    };

    var METHODNAME = {
        className: 'function method',
        endsParent: true,
        begin: '\\w+:',
        end: '\\s'
    };

    var METHODPATH = {
        className: 'string',
        contains: [METHODNAME],
        starts: MESSAGE,
        begin: '\\s',
        end: /:/
    };

    var TIME = {
        className: 'code time',
        begin: '\\s\\d{2}:\\d{2}:\\d{2} (A|P)M'
    };

    var DATE = {
        className: 'comment date',
        starts: TIME,
        begin: '\\d{2}/\\d{2}/\\d{4}'
    };

    var DATETIME = {
        className: 'comment datetime',
        contains: [DATE, TIME],
        starts: METHODPATH,
        begin: '\\[',
        end: '\\]\\s*'
    };

    var THREAD = {
        className: 'comment thread',
        starts: DATETIME,
        begin: '^\\[\\d+:\\d+\\]',
        end: '-'
    };

    return {
        contains: [
            THREAD
        ]
    };
};
