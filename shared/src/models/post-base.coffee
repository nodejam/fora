ForaDbModel = require('./foramodel').ForaDbModel

class PostBase extends ForaDbModel

    @typeDefinition: ->
        {
            name: "post",
            collection: 'posts',
            initialize: (obj) ->*
                yield obj.initialize()
            schema: {
                type: 'object',        
                properties: {
                    type: { type: 'string' },
                    forumId: { type: 'string' },
                    forum: { $ref: 'forum-summary' },
                    createdById: { type: 'string' },
                    createdBy: { $ref: 'user-summary' },
                    meta: { type: 'array', items: { type: 'string' } },
                    tags: { type: 'array', items: { type: 'string' } },
                    stub: { type: 'string' },
                    recommendations: { type: 'array', items: { $ref: 'user-summary' } },            
                    state: { type: 'string', enum: ['draft','published'] },
                    savedAt: { type: 'integer' }
                },
                required: ['type', 'forumId', 'forum', 'createdById', 'createdBy', 'meta', 'tags', 'stub', 'recommendations', 'state', 'savedAt']
            },
            indexes: [
                { 'state': 1, 'forum.stub': 1 },
                { 'state': 1, 'forumId': 1 },
                { 'state': 1, 'createdAt': 1, 'forum.stub': 1 }, 
                { 'createdById' : 1 },
                { 'createdBy.username': 1 }
            ],
            links: {
                forum: { type: 'forum', key: 'forumId' }
            }
            autoGenerated: {
                createdAt: { event: 'created' },
                updatedAt: { event: 'updated' }
            },            
            trackChanges: true,
            logging: {
                onInsert: 'NEW_POST'
            }
        }

    
exports.PostBase = PostBase