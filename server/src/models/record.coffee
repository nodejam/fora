utils = require '../lib/utils'
mdparser = require('../lib/markdownutil').marked
models = require('./')
Q = require('../lib/q')
ForaModel = require('./foramodel').ForaModel
ForaDbModel = require('./foramodel').ForaDbModel

class Record extends ForaDbModel
    
    class Cover extends ForaModel
        @describeType: {
            type: @,
            alias: '',
            fields: {
                image: 'string',
                small: 'string',
                alt: 'string !required'
            }
        }
        
        @toJSON: ->
            "Record.Fields.Cover"
        
        
    class TextContent extends ForaModel
        @describeType: {
            type: @,
            fields: {
                text: 'string',
                format: 'string'
            }
        }
    
        formatContent: =>
            switch @format
                when 'markdown'
                    if @text then mdparser(@text) else ''
                when 'html', 'text'
                    @text
                else
                    'Invalid format.'

        @toJSON: ->
            "Record.Fields.TextContent"
    

    @Fields: {
        Cover: Cover,
        TextContent: TextContent
    }
    
    @describeType: {
        type: @,
        collection: 'records',
        discriminator: (obj) -> 
            switch obj.type
                when 'article' then models.Article
                when 'conversation' then models.Conversation
                else Record                
        fields: {
            type: 'string',
            collection: { type: models.Collection.Summary },
            createdBy: { type: models.User.Summary },
            meta: { type: 'array', contentType: 'string' },
            tags: { type: 'array', contentType: 'string' },
            stub: { type: 'string' },
            recommendations: { type: 'array', contentType: models.User.Summary },            
            state: { type: 'string', $in: ['draft','published'] },
            savedAt: { type: 'number' },
            createdAt: { autoGenerated: true, event: 'created' },
            updatedAt: { autoGenerated: true, event: 'updated' }
        },
        trackChanges: true,
        logging: {
            onInsert: 'NEW_POST'
        }
    }


    @search: (criteria, settings, context, db) =>
        limit = @getLimit settings.limit, 100, 1000
                
        params = {}
        for k, v of criteria
            params[k] = v
        
        Record.find params, ((cursor) -> cursor.sort(settings.sort).limit limit), context, db
        

        
    @getLimit: (limit, _default, max) ->
        result = _default
        if limit
            result = limit
            if result > max
                result = max
        result    


    
    constructor: (params) ->
        super
        @recommendations ?= []
        @meta ?= []
        @tags ?= []
       
    
    
    addMetaList: (metaList) =>
        (Q.async =>
            @meta = @meta.concat (m for m in metaList when @meta.indexOf(m) is -1)
            yield @save()
        )()
        


    removeMetaList: (metaList) =>
        (Q.async =>
            @meta = (m for m in @meta when metaList.indexOf(m) is -1)
            yield @save()
        )()
            
    
    
    save: (context, db) =>
        { context, db } = @getContext context, db
        
        (Q.async =>        
            if not @_id            
                typeDesc = @getTypeDefinition()
                if typeDesc.stub and @[typeDesc.stub]
                    @stub = @[typeDesc.stub].toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9|-]/g, '').replace(/^\d*/,'')
                    #check if the stub exists
                    record = yield Record.get({ @stub, 'collection.id': @collection.id }, context, db)
                    if record
                        @stub = @_id.toString() + "-" + @stub
                    result = yield super(context, db)               
                else                    
                    @stub = utils.uniqueId()
                    record = yield super(context, db)
                    @stub = record._id.toString()
                    result = yield record.save context, db
            else
                #check if the stub exists, if the stub has changed.
                if @stub isnt @getOriginalModel().stub
                    record = yield Record.get({ @stub, 'collection.id': @collection.id }, context, db)
                    if record
                        @stub = @_id.toString() + "-" + @stub

                result = yield super(context, db)
                
            if @state is 'published'
                collection = yield models.Collection.getById @collection.id, context, db
                collection.refreshSnapshot()
            
            return result)()

        
            
exports.Record = Record
