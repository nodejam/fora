(function() {
    "use strict";

    var _;

    var models = require('./'),
        randomizer = require('fora-app-randomizer'),
        services = require('fora-app-services'),
        dataUtils = require('fora-data-utils'),
        DbConnector = require('fora-app-db-connector');

    /*
        A session token starts life as a credential token.
        A credential token can be converted into a user-session token.
    */
    var Session = function(params) {
        dataUtils.extend(this, params);
    };

    var sessionStore = new DbConnector(Session);

    Session.typeDefinition = {
        name: 'session',
        collection: 'sessions',
        schema: {
            type: 'object',
            properties: {
                credentialId: { type: 'string' },
                userId: { type: 'string' },
                token: { type: 'string' },
                user: { $ref: 'user-summary' }
            },
            required: ['credentialId', 'token']
        },
        links: {
            credential: { key: 'credentialId' },
        },
        autoGenerated: {
            createdAt: { event: 'created' },
            updatedAt: { event: 'updated' }
        },
        indexes: [
            { 'userId': 1, 'token': 1 },
        ]
    };


    /*
        Upgrades a credential token to a user token.
        User tokens can be used to login to the app.
    */
    Session.prototype.upgrade = function*(username) {
        var userStore = new DbConnector(models.User);
        var user = yield* userStore.findOne({ username: username, credentialId: this.credentialId });
        if (user) {
            this.token = randomizer.uniqueId(24);
            this.userId = user._id.toString();
            this.user = yield* user.summarize();
            return yield* sessionStore.save(this);
        } else {
            throw new Error("User not found");
        }
    };

    exports.Session = Session;

})();
