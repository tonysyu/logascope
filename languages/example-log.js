/*global module*/

/*
[111:2222]-[10/23/2015 12:00:00 AM] Package.Module.Class.Method: message
        []
[111:2222]-[10/23/2015 12:00:00 AM] Package.Module.Class.Method: message
*/

module.exports = function (hljs) {
    "use strict";

    var thread = '\\[\\d+:\\d+\\]',
        time = '\\s\\d{2}:\\d{2}:\\d{2} (A|P)M',
        date = '\\d{2}/\\d{2}/\\d{4}';

    var METHODPATH = {
        className: 'string',
        begin: /[\w.]+/,
        end: ':'
    };

    var TIME = {
        className: 'code',
        begin: time
    };

    var DATE = {
        className: 'comment',
        starts: TIME,
        begin: date
    };

    var DATETIME = {
        className: 'comment',
        contains: [DATE, TIME],
        starts: METHODPATH,
        begin: '\\[',
        end: '\\]'
    };

    var THREAD = {
        className: 'comment',
        starts: DATETIME,
        begin: '^' + thread,
        end: '-'
    };

    return {
        contains: [
            THREAD
        ]
    };
};
