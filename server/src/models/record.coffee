utils = require '../lib/utils'
models = require('./')
Q = require('../lib/q')
widgets = require '../common/widgets'
ForaModel = require('./foramodel').ForaModel
ForaDbModel = require('./foramodel').ForaDbModel

class Record extends ForaDbModel
    
    @typeDefinition: {
        type: @,
        alias: "Record",
        collection: 'records',
        discriminator: (obj) -> 
            switch obj.type
                when 'article' then models.Article
                when 'conversation' then models.Conversation
                else Record                
        fields: {
            type: 'string',
            collection: "Collection.Summary",
            createdBy: "User.Summary",
            meta: { type: 'array', contents: 'string' },
            tags: { type: 'array', contents: 'string' },
            stub: { type: 'string' },
            recommendations: { type: 'array', contents: "User.Summary" },            
            state: { type: 'string', $in: ['new', 'draft','published'] },
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
                typeDefinition = @getTypeDefinition()
                if typeDefinition.stub and @[typeDefinition.stub]
                    @stub = @[typeDefinition.stub].toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9|-]/g, '').replace(/^\d*/,'')
                    #check if the stub exists
                    record = yield Record.get({ @stub, 'collection.id': @collection.id }, context, db)
                    if record
                        @stub = @_id.toString() + "-" + @stub
                    result = yield super(context, db)               
                else                    
                    @stub = "temp_#{utils.uniqueId()}"
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



    #Dummy. So that a data error doesn't blow up the app.
    getTemplate: (name = "standard") =>
        @parseTemplate {
            widget: "recordview",                    
            itemPane: [],
            sidebar: []
        }        
        
        

    
    parseTemplate: (data) =>    
        if data instanceof Array
            (@parseTemplate(i) for i in data)
        else if data.widget
            ctor = if typeof data.widget is 'string' then @getWidget(data.widget) else data.widget
            params = {}
            for k, v of data
                if k isnt 'widget'
                    params[k] = @parseTemplate v
            new ctor params
        else
            data
                


    getWidget: (name) =>
        switch name
            when 'image'
                widgets.Image
            when 'heading'
                widgets.Heading
            when 'authorship'
                widgets.Authorship
            when 'text'
                widgets.Text
            when 'recordview'
                widgets.RecordView
            when 'cardview'
                widgets.CardView
            
exports.Record = Record
