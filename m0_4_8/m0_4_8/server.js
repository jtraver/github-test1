/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
/*jslint bitwise: true, node: true, nomen: true, regexp: true, sloppy: true, white: true */

/*
 * Analyzing the current hostname to try to set the correct environment context in mojito. More info here:
 * http://devel.corp.yahoo.com/cocktails/mojito/docs/topics/mojito_using_contexts.html
 */
function getEnvName() {
    var result,
        domain = process.env.manhattan_context__instance_hostname || process.env.HOSTNAME || 'localhost',
        /* make sure you're using dimensions.json to define all the available environments for your app */
        whitelist = ["development", "smoke", "regression", "functional", "staging", "manhattan-stage", "performance", "production", "localhost", "corp"];

    console.log('[server.js] Detected environment context for: ' + domain + ' | ' + process.env.yroot_network_util__hostname + ' (' + process.env.yroot_network_util__ip + ':' + process.env.ynodejs__port + ')');

    whitelist.forEach(function(env) {
        if (domain.indexOf(env) >= 0) {
            console.log('[server.js] We found a match: '+env);
            result = env;
        }
    });
    return result;
}

process.chdir(__dirname);

/*
 * Create the MojitoServer instance we'll interact with. Options can be passed
 * using an object with the desired key/value pairs.
 */
var Mojito = require('mojito');
var app = Mojito.createServer({
    context: {
        environment: getEnvName() 
    }
});

module.exports = function(config, token) {
    process.emit('application-ready', token, app.getHttpServer());
};

// module.exports = app.listen();
