/*global module*/

/*
[111:2222]-[10/23/2015 12:00:00 AM] Package.Module.Class.Method: message
    select * from [mytable] where a=b;
[111:2222]-[10/23/2015 12:00:00 AM] Package.Module.Class.Method: message
    select * from mytable where a=b;
[111:2222]-[10/23/2015 12:00:00 AM] Package.Module.Class.Method: message
    {"a": 1, "b": 2}
*/

module.exports = function (hljs) {
    "use strict";

    var thread = '\\[\\d+:\\d+\\]',
        time = '\\s\\d{2}:\\d{2}:\\d{2} (A|P)M',
        date = '\\d{2}/\\d{2}/\\d{4}';

    var MESSAGE = {
        begin: '\\s*\\w',
        end: /([\r\n]\[|\Z)/,
        returnEnd: true,
        subLanguage: ['json', 'sql']
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
        begin: time
    };

    var DATE = {
        className: 'comment date',
        starts: TIME,
        begin: date
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
        begin: '^' + thread,
        end: '-'
    };

    return {
        contains: [
            THREAD
        ]
    };
};
