var _ = require("underscore");
var resolve = require("resolve");
var path = require("path");

var getCallerDirname = module.exports.getCallerDirname = function(skip) {
    skip = skip||0;
    try {
        var err = new Error();
        var callerFile;
        var pst = Error.prepareStackTrace;
        Error.prepareStackTrace = function (err, stack) { return stack; };
        while (err.stack.length) {
            callerFile = err.stack.shift().getFileName();
            if (callerFile.indexOf("pick-require")===-1) {
                for (var i=0; i<skip; i++) {
                    callerFile = err.stack.shift().getFileName();
                }
                Error.prepareStackTrace = pst;
                return path.dirname(callerFile);
            }
        }
    }
    catch (err) {
    }
    Error.prepareStackTrace = pst;
    return undefined;
}

var resolveDependencyRoot = module.exports.resolveDependencyRoot = function(dependency, from) {
    var callerDirname = from||getCallerDirname();
    var dependencyPath = resolve.sync(dependency, {
        basedir:callerDirname
    });
    var fullPath = path.dirname(dependencyPath);
    var parts = fullPath.split("/");
    for (var i=parts.length; i>0; i--) {
        if (parts[i-1]==="node_modules") {
            break;
        }
    }
    var dependencyRoot = parts.slice(0, i+1).join("/");
    return dependencyRoot;
}
