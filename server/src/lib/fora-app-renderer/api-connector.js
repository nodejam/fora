(function() {
    "use strict";

    var _;

    var visit = require('fora-data-utils').visit;
    var models = require('fora-models');

    var ApiConnector = function(requestContext, router) {
        this.requestContext = requestContext;
        this.requestContext.apiCache = this.requestContext.apiCache || [];
        this.router = router;
        this.routeFn = router.route();
    };


    ApiConnector.prototype.get = function*(url) {
        var requestContext = yield* this.makeRequest("GET", url);

        var response = requestContext.body;

        //On the client, we can't tell if the deserialized JSON needs to go through a constructor.
        //So, set a flag __mustReconstruct.
        response = yield* visit(
            response,
            function*(x) {
                if (x instanceof models.BaseModel) {
                    return {
                        value: x,
                        stop: true,
                        fnAfterVisit: function*(o) {
                            o._mustReconstruct = true;
                            return o;
                        }
                    };
                }
            }
        );

        /*
            This could be use to write out a stringified JSON response directly on the web page.
            A client side script calling the same method doesn't then do the actual fetch.
        */
        this.requestContext.apiCache.push({
            requestContext: {
                url: requestContext.url,
                method: requestContext.method,
                query: requestContext.query,
                body: response
            }
        });

        return response;
    };


    ApiConnector.prototype.makeRequest = function*(method, url) {
        var requestContext = yield* this.requestContext.clone();
        requestContext.url = url;
        requestContext.method = method;
        _ = yield* this.routeFn.call(requestContext);

        return requestContext;
    };


    ApiConnector.prototype.getRoutingContext = function*(url, method) {
        return {};
    };


    module.exports = ApiConnector;

})();
