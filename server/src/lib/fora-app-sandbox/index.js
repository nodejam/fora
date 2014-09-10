(function() {
    "use strict";

    var _;

    var TrustedSandbox = require('./trusted-sandbox'),
        UntrustedSandbox = require('./untrusted-sandbox');


    var Sandbox = function(services, extensionModuleName) {
        this.services = services;
        this.extensionsService = services.get('extensionsService');
        this.extensionModuleName = extensionModuleName;
    };


    Sandbox.prototype.executeRequest = function*(requestContext) {
        var extension = yield* this.extensionsService.getExtensionByName(
            "app",
            requestContext.app.type,
            requestContext.app.version
        );

        //We can't pass extension to Untrusted sandboxen, since it will execute outside this process boundary.
        //For example, inside another process, or even a machine.
        var sandbox = extension ?
            new TrustedSandbox(extension, this.extensionModuleName) : new UntrustedSandbox(this.extensionModuleName);
        return yield* sandbox.executeRequest(requestContext);
    };


    module.exports = Sandbox;

})();
