(function() {
    "use strict";

    var DbConnector = require('fora-app-db-connector'),
        dataUtils = require('fora-data-utils');


    var Membership = function(params) {
        dataUtils.extend(this, params);
    };

    var membershipStore = new DbConnector(Membership);

    Membership.typeDefinition = {
        name: "membership",
        collection: 'memberships',
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'string' },
                user: { $ref: 'user-summary'},
                appId: { type: 'string' },
                roles: { type: 'array', items: { type: 'string' } },
            },
            required: ['userId', 'user', 'appId', 'roles'],
        },
        links: {
            user: { type: 'user', key: 'userId' },
            app: { type: 'app', key: 'appId' }
        },
        autoGenerated: {
            createdAt: { event: 'created' },
            updatedAt: { event: 'updated' }
        },
    };


    Membership.prototype.save = function*() {
        return yield* membershipStore.save(this);
    };


    exports.Membership = Membership;

})();
