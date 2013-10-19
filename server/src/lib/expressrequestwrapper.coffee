###
    A safe wrapper around the request to hide access to query, params and body.
    This allows us to sanitize those fields when requested.    
###

utils = require './utils'
typeutils = require './data/typeutils'
validator = require 'validator'

class ExpressRequestWrapper

    constructor: (@raw) ->
        @headers = @raw.headers

    
    
    getParameter: (src, name, def = "string") =>
        if typeof def is 'string' 
            def = typeutils.getFieldDefinition def
        val = @raw[src][name]
        @parsePrimitive val, def, name
        

    
    params: (name, type) =>
        @getParameter 'params', name, type
        

    
    query: (name, type) =>
        @getParameter 'query', name, type



    body: (name, type) =>
        @getParameter 'body', name, type
    

    
    cookies: (name, type) =>
        @getParameter 'cookies', name, type
        
    
    
    files: =>
        @raw.files


    
    map: (target, whitelist, options = { overwrite: true }, prefix = []) =>
        typeDef = target.getTypeDefinition()        
        for field, def of typeDef.fields
            if @populateObject(target, field, def, whitelist, options, prefix)
                modified = true
        modified
                
        

    
    populateObject: (obj, name, def, whitelist, options, prefix) =>
        if not obj[name] or options.overwrite
            if name isnt '_id' and def.map isnt false and not def.autoGenerated
                def = typeutils.getFieldDefinition def
                fullName = prefix.concat(name).join '_'
                if typeutils.isPrimitiveType(def.type)
                    if whitelist.indexOf(fullName) > -1
                        val = @body fullName, 'string'
                        if val
                            obj[name] = @parsePrimitive val, def, fullName
                            true            
                        else
                            if def.map isnt false and def.default
                                obj[name] = if typeof def.map.default is "function" then def.map.default(obj) else def.map.default
                                true
                else
                    prefix.push name
                    
                    if def.type is 'object' or def.type is ''
                        newObj = {}
                        #Decide what to do here...
                    else
                        newObj = new def.type()
                        modified = @map(newObj, whitelist, options, prefix)
                        
                    #Check if something was filled.
                    if modified
                        obj[name] = newObj
                    prefix.pop()



    parsePrimitive: (val, def, fieldName) =>
        switch def.type
            when 'number'
                (if def.integer then parseInt else parseFloat) val
            when 'string'
                validator.sanitize(val).xss()
            when 'boolean'
                val is "true"
            when 'array'
                if def.map?.format is 'csv'
                    contentType = typeutils.getFullTypeDefinition def.contentType
                    (@parsePrimitive(vs, contentType, fieldName) for v in val.split(','))                    
                else
                    throw new Error "Cannot parse this array. Unknown format."
            else      
                throw new Error "#{def.type} #{fieldName} is a non-primitive. Cannot parse."
                
exports.ExpressRequestWrapper = ExpressRequestWrapper
