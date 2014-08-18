(function() {
    "use strict";

    var co = require('co'),
        logger = require('../../common/logger'),
        fs = require('fs'),
        path = require('path'),
        FileService = require('../../common/file-service'),
        models = require('../../models'),
        conf = require('../../config');

    var fileService = new FileService(conf);

    //create directories
    var today = Date.now();
    ['assets', 'images', 'original-images'].forEach(function(p) {
        for(var i = 0; i <=999; i++) {
            (function(i) {
                var newPath = fileService.getDirPath(p, i.toString());
                fs.exists(newPath, function(exists) {
                    if (!exists) {
                        fs.mkdir(newPath, function() {});
                        logger.log("Created " + newPath);
                    } else {
                        logger.log(newPath + " exists");
                    }
                });
            })(i);
        }
    });

    //ensure indexes.
    (co(function*() {
        var odm = require('fora-models');
        _ = yield* typesService.init([models, fields], models.App, models.Record);

        var db = new odm.Database(conf.db);
        _ = yield* db.setupIndexes(typesService.getTypeDefinitions());

        console.log("wait for 5 seconds...");
        setTimeout(function() {
            console.log("done");
            process.exit();
        }, 5000);
    }))();

})();