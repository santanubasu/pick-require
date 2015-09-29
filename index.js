var _ = require("underscore");
var resolve = require("resolve");
var path = require("path");

function _getCallerDirname() {
    try {
        var err = new Error();
        var callerFile;
        var currentFile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentFile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerFile = err.stack.shift().getFileName();
            if (currentFile !== callerFile) {
                return path.dirname(callerFile);
            }
        }
    }
    catch (err) {
    }
    return undefined;
}

function _resolveDependencyRoot(dependency) {
    var callerDirname = _getCallerDirname();
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

module.exports = function(dependency) {
    var callerDirname = _getCallerDirname();
    var dependencyRoot = _resolveDependencyRoot(dependency);
    return require(path.join(dependencyRoot, "/metapath.js"));
}
