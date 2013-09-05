AppModel = require('./appmodels').AppModel
DatabaseAppModel = require('./appmodels').DatabaseAppModel
ExtensibleAppModel = require('./appmodels').ExtensibleAppModel
Q = require('../common/q')

class Forum extends ExtensibleAppModel

    class Settings extends AppModel
        @describeModel: ->
            {
                type: @,
                fields: {
                    comments: {
                        type: 'object',
                        required: false,
                        fields: {
                            enabled: { type: 'boolean', required: false },
                            opened: { type: 'boolean', required: false }
                        }
                    }
                }
            }    
            
    @Settings: Settings            
        
    class Summary extends AppModel    
        @describeModel: ->
            {
                type: @,
                fields: {
                    id: 'string',
                    network: 'string',
                    name: 'string',
                    stub: 'string',
                    createdBy: @getModels().User.Summary
                }
            }    
            
    @Summary: Summary
            
    @describeModel: ->
        {
            type: @,
            collection: 'forums',
            fields: {
                network: 'string',
                name: 'string',
                stub: 'string',
                settings: { type: Settings },
                icon: 'string',
                iconThumbnail: 'string',
                cover: { type: 'string', required: false },
                createdBy: { type: @getModels().User.Summary },
                snapshot: 'object',
                totalPosts: 'number',
                totalMembers: 'number',
                lastPost: 'number', 
                permissions: {
                    type: 'object',
                    fields: {
                        moderator: {
                            type: 'object',
                            fields: {
                                write: { type: 'boolean', required: false }
                            },
                            required: false
                        },
                        member: {
                            type: 'object',
                            fields: {
                                write: { type: 'boolean', required: false },
                                read: { type: 'boolean', required: false }
                                comment: { type: 'boolean', required: false }
                            },
                            required: false
                        },
                        everyone: {
                            type: 'object',
                            fields: {
                                write: { type: 'boolean', required: false },
                                read: { type: 'boolean', required: false }
                                comment: { type: 'boolean', required: false }
                            },
                            required: false
                        }
                    }
                }
                createdAt: { autoGenerated: true, event: 'created' },
                updatedAt: { autoGenerated: true, event: 'updated' }
            },
            logging: {
                    onInsert: 'NEW_FORUM'
            },
            extendedFieldPrefix: 'Forum'
        }
        


    constructor: (params) ->
        super
        @totalPosts ?= 0
        @totalMembers ?= 0
        @settings ?= {}
        @snapshot ?= { posts: [] }
        @lastPost ?= 0
        @permissions = {}                

        
        
    summarize: =>        
        summary = new Summary {
            id: @_id.toString()
            network: @network,
            name: @name,
            stub: @stub,
            createdBy: @createdBy
        }
        
        
        
    getView: (name = "standard") =>
        switch name
            when 'card'
                {
                    id: @_id.toString()
                    @network,
                    @name,
                    @stub,
                    @createdBy,
                    @snapshot,
                    image: @icon
                }
                


    hasPermission: (permissionName, userid, context, db) =>
        (Q.async =>
            membership = yield @getModels().Membership.get { forumid: @_id.toString(), userid }, context, db
            permissions = getPermissions membership.roles
            permissions[permissionName]
        )()


    
    getPermissions: (roles) =>
        perms = []
        for role in roles
            perms.push switch role
                when 'admin'
                    {
                        write: true,
                        read: true,
                        comment: true,
                        moderate: true,
                        admin: true
                    }
                when 'moderator'
                    {
                        write: @permissions.moderator?.write ? true,
                        read: true,
                        comment: true,
                        moderate: true,
                        admin: false
                    }
                when 'member'
                    {
                        write: @permissions.member?.write ? true,
                        read: @permissions.member?.read ? true,
                        comment: @permissions.member?.comment ? true,
                        moderate: false,
                        admin: false
                    }
                when 'everyone'
                    {
                        write: @permissions.everyone?.write ? false,
                        read: @permissions.everyone?.read ? true,
                        comment: @permissions.everyone?.comment ? false,
                        moderate: false,
                        admin: false
                    }

        check = (name) ->
            (p for p in perms when p[name] is true).length > 0

        {
            write: check 'write',
            read: check 'read',
            comment: check 'comment',
            moderate: check 'moderate',
            admin: check 'admin'
        }
            


    getPosts: (limit, sort, context, db) =>
        { context, db } = @getContext context, db
        (Q.async =>
            yield @getModels().Post.find({ 'forum.stub': @stub, 'forum.network': @network }, ((cursor) -> cursor.sort(sort).limit limit), context, db)
        )()
        

    
    addMembership: (user, roles, context, db) =>
        { context, db } = @getContext context, db
        (Q.async =>
            membership = yield @getModels().Membership.get { 'forum.id': @_id.toString(), 'user.id': user.id }, context, db
            if not membership
                membership = new (@getModels().Membership) {
                    forum: @summarize(),
                    user: user
                }
            membership.roles = roles
            yield membership.save context, db   
            cursor = yield @getModels().Membership.getCursor { 'forum.id': @_id.toString() }, context, db
            @totalMembers = yield Q.nfcall cursor.count.bind(cursor)
            yield @save()
        )()
                
                
                
    getMemberships: (roles, context, db) =>
        { context, db } = @getContext context, db
        (Q.async =>
            yield @getModels().Membership.find { 'forum.id': @_id.toString(), roles: { $in: roles } }, ((cursor) -> cursor.sort({ id: -1 }).limit 200), context, db
        )()        
        
                
            
    refreshSnapshot: (context, db) =>
        { context, db } = @getContext context, db
        (Q.async =>
            posts = yield @getModels().Post.find({ 'forum.id': @_id.toString() , state: 'published' }, ((cursor) -> cursor.sort({ _id: -1 }).limit 10), context, db)
            @snapshot = { posts: p.getView("snapshot") for p in posts }
            if posts.length
                @lastPost = posts[0].publishedAt
            yield @save context, db)()
            
    
exports.Forum = Forum
