ForaDbModel = require('./foramodel').ForaDbModel
hasher = require('../lib/hasher')
models = require('./')


class Credential extends ForaDbModel
    
    emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    @typeDefinition: {
        name: 'credential',
        collection: 'credential',
        schema: {
            type: 'object',        
            properties: {
                email: { type: 'string' },                
                preferences: { 
                    type: 'object',
                    schema: {
                        properties: {
                            canEmail: { type: 'boolean' }
                        }
                    }
                },
                builtin: { 
                    type: 'object',
                    schema: {
                        properties: {
                            hash: { type: 'string' },
                            salt: { type: 'string' }
                        }
                        required: [ 'hash', 'salt' ]
                    }
                },
                twitter: {
                    type: 'object',
                    schema: {
                        properties: {
                            id: { type: 'string' },
                            username: { type: 'string' },
                            accessToken: { type: 'string' }
                            accessTokenSecret: { type: 'string' }
                        }
                        required: [ 'id', 'username', 'accessToken', 'accessTokenSecret' ]
                    }
                },
                facebook: {
                    type: 'object',
                    schema: {
                        properties: {
                            id: { type: 'string' },
                            username: { type: 'string' },
                            accessToken: { type: 'string' }
                        }
                        required: [ 'id', 'username', 'accessToken' ]
                    }
                }                
            },
            required: ['type', 'email', 'preferences']
        },
        autoGenerated: {
            createdAt: { event: 'created' },
            updatedAt: { event: 'updated' }
        },
        indexes: [
            { 'type': 1, 'email': 1 },
        ],
        validate: (fields) ->*
            if not emailRegex.test(@email)
                ['Invalid email']            
    }    


    #Todo. Token Expiry.   
    @authenticateBuiltin: (username, password, context, db) ->*
        credential = yield models.credential.get({ "builtin.username": username }, context, db)
        if credential
            salt = new Buffer credential.builtin.salt, 'hex'
            result = yield thunkify(hasher) {plaintext: password, salt}
            if credential.hash is result.key.toString 'hex'
                { token: credential.token }
            else
                { success: false, error: "Invalid username or password" }
        else
            { success: false, error: "Invalid username or password" }
        

exports.Credential = Credential