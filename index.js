var path = require("path");
var util = require("./util.js");

module.exports = function(dependency, resource) {
    var callerDirname = util.getCallerDirname();
    var dependencyRoot = util.resolveDependencyRoot(dependency);
    return require(path.join(dependencyRoot, resource));
}
