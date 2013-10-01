utils = require '../common/utils'
BaseModel = require('../common/data/basemodel').BaseModel
DatabaseModel = require('../common/data/databasemodel').DatabaseModel
fsutils = require '../common/fsutils'
Q = require '../common/q'
hasher = require('../common/lib/hasher').hasher
models = require './'

emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

class User extends DatabaseModel

    class Summary extends BaseModel    
        @describeType: {
            type: @,
            fields: {
                id: 'string',
                username: 'string',
                name: 'string',
                assetPath: 'string'
            }
        }    
    
    @Summary: Summary
    
    @describeType: {
        type: @,
        collection: 'users',
        fields: {
            username: 'string',
            name: 'string',
            location: 'string',
            email: { type: 'string', validate: -> emailRegex.test(@email) },
            accessToken: { type: 'string', required: false },
            lastLogin: 'number',
            assetPath: 'string',
            following: { type: 'array', contentType: -> models.User.Summary },
            subscriptions: { type: 'array', contentType: -> models.Collection.Summary },
            about: { type: 'string', required: false },
            createdAt: { autoGenerated: true, event: 'created' },
            updatedAt: { autoGenerated: true, event: 'updated' }
        },
        logging: {
            onInsert: 'NEW_USER'
        }
    }
       

   
    @create: (userDetails, authInfo, context, db) ->
        (Q.async =>
            #We can't create a new user with an existing username.
            username = userDetails.username
            user = yield User.get { username }, context, db
            
            #We have to download the profile pic.

            if not user
                user = new User { username: userDetails.username }
                user.updateFrom userDetails
                user = yield user.save context, db
                
                #Also create a userinfo
                userinfo = new (models.UserInfo) {
                    userid: user._id.toString(),
                    username: user.username
                }
                userinfo = yield userinfo.save context, db
                
                credentials = new (models.Credentials) {
                    userid: user._id.toString(),
                    username,
                    token: utils.uniqueId(24)                    
                }

                switch authInfo.type
                    when 'builtin'
                        result = yield Q.nfcall(hasher, { plaintext: authInfo.value.password })
                        salt = result.salt.toString 'hex'
                        hash = result.key.toString 'hex'
                        credentials.builtin = { method: 'PBKDF2', username, hash, salt }
                    when 'twitter'
                        credentials.twitter = authInfo.value
                
                credentials = yield credentials.save context, db
                        
                { user, token: credentials.token }            
            else
                { success: false, error: "User aready exists" }
        )()
            

                                                            
    @getByUsername: (username, context, db) ->
        User.get({ username }, context, db)



    constructor: (params) ->
        super
        @about ?= ''
        @karma ?= 1
        @preferences ?= {}
        @following ?= []
        @followerCount ?= []
        @subscriptions ?= []
        @totalItemCount ?= 0



    getUrl: =>
        "/~#{@username}"



    updateFrom: (userDetails) =>
        @name = userDetails.name
        @location = userDetails.location
        @email = userDetails.email ? 'unknown@foraproject.org'
        @lastLogin = Date.now()
        @preferences ?= { canEmail: true }
        if userDetails.about
            @about = userDetails.about

        #Allow dev scripts to set assetPath for initial set of users, so that it stays the same.
        if userDetails.createdVia is 'internal' and userDetails.assetPath
            @assetPath = userDetails.assetPath    
        else
            dateDir = fsutils.getDateFormattedDir Date.now()
            @assetPath = "/pub/assetpaths/#{dateDir}"



    summarize: =>
        new Summary {
            id: @_id.toString()
            username: @username
            name: @name,
            @assetPath
        }
        
    
exports.User = User
