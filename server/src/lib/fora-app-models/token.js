(function() {
    "use strict";

    var dataUtils = require('fora-data-utils');
    
    var Token = function(params) {
        dataUtils.extend(this, params);
    };

    Token.typeDefinition = {
        name: "token",
        collection: 'tokens',
        schema: {
            type: 'object',
            properties: {
                type: { type: 'string' },
                key: { type: 'string' },
                value: {
                    type: 'object'
                },
            },
            required: ['type', 'key', 'value']
        },
        indexes: [{ 'key': 1 }],
    };

    exports.Token = Token;

})();
