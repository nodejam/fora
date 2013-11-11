ForaDbModel = require('./foramodel').ForaDbModel
models = require('./')
Q = require 'q'

class Membership extends ForaDbModel
    
    @typeDefinition: {
        type: @,
        alias: "Membership",
        collection: 'memberships',
        fields: {
            user: "User.Summary",
            forum: "Forum.Summary",
            roles: { type: 'array', contents: 'string' },
            createdAt: { autoGenerated: true, event: 'created' },
            updatedAt: { autoGenerated: true, event: 'updated' }
        },
    }    


exports.Membership = Membership
