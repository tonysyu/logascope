/*global module*/

/*
[111:2222]-[10/23/2015 12:00:00 AM] Package.Module.Class.Method: message
        []
[111:2222]-[10/23/2015 12:00:00 AM] Package.Module.Class.Method: message
*/

module.exports = function (hljs) {
    "use strict";

    var thread = '\\[\\d+:\\d+\\]',
        time = '\\d{2}:\\d{2}:\\d{2} (A|P)M',
        date = '\\d{2}/\\d{2}/\\d{4}',
        datetime = '\\[' + date + ' ' + time + '\\]';

    var METHODPATH = {
        className: 'string',
        begin: /[\w.]+/,
        end: ':'
    };

    var TIME = {
        className: 'code',
        begin: time,
    };

    var DATE = {
        className: 'comment',
        starts: TIME,
        begin: date
    };

    var DATETIME = {
        contains: [DATE, TIME],
        starts: METHODPATH,
        begin: datetime,
        returnBegin: true
    };

    var THREAD = {
        className: 'comment',
        starts: DATE,
        begin: '^' + thread,
        end: '-'
    };

    return {
        keywords: {
            keyword: 'Package'
        },
        contains: [
            THREAD, DATE, TIME
        ]
    };
};
