#!/bin/bash

help() {
echo "usage: ./compile [options]"
echo "options: --debug, --es5, --dont-delete"
}

debug=false
dont_delete=false
skip_es5_transform=true

while :
do
    case $1 in
        --debug)
            debug=true 
            echo "Compiling in debug mode"
            shift
            ;;
        --es5)
            skip_es5_transform=false
            echo "Compiling for ES5"
            shift
            ;;
        --dont-delete)
            dont_delete=true
            shift
            ;;
        --help)
            help
            exit 0
            ;;
        -*)
            echo "WARN: Unknown option (ignored): $1" >&2
            shift
            ;;
        *)  # no more options. Stop while loop        
            break
            ;;
    esac
done


if ! $dont_delete; then
    echo "Deleting the app directory"
    rm -rf app
    mkdir app
else
    echo "Not deleting the app directory"
fi

temp=`mktemp -d`
echo "Copying src to app.."
cp -r src/* $temp
find $temp -name '*.coffee' | xargs rm -rf
find $temp -name '*.less' | xargs rm -rf
find $temp -name '*.*~' | xargs rm -rf
cp -r $temp/* app
rm -rf $temp

# echo Compiling coffee to js
echo "Compiling CoffeeScript files.."
coffee -o app/ -c src/

#We have to copy the builtin React components into the client folder; they need to be served to browsers
echo copy client-side extensions...
cp ../server/app/extensions/forums/* app/www/shared/extensions/forums -r -v
cp ../server/app/extensions/posts/* app/www/shared/extensions/posts -r -v
cp ../server/app/website/views/* app/www/shared/website/views -r -v
cp ../server/app/app-lib/fora-ui/controls/* app/www/shared/app-lib/fora-ui/controls -r -v

#Run it through generator.
#This step is unnecessary if we are using node --harmony
compile_to_es5() {
    dir=`pwd`/$1
    if $2; then
        echo "Processing $dir (regenerator --include-runtime)"
        find $dir -name *.js -type f -exec sh -c 'regenerator --include-runtime {} > {}' \; 
    else
        echo "Processing $dir (regenerator)"
        find $dir -name *.js -type f -exec cp {} {}.es6 \; -exec sh -c 'regenerator {}.es6 > {}' \;
        #find $dir -name *.js -type f -exec sh -c 'regenerator {} > {}' \; 
    fi
}

if ! $skip_es5_transform; then
    echo Running regenerator on app/scripts..
    compile_to_es5 "app/scripts" true
fi

echo Running regenerator on app/www/js..
compile_to_es5 "app/www/js" false
compile_to_es5 "app/www/shared" false

echo "Running LESS.."
lessc --verbose src/www/css/main.less app/www/css/main.css


if $debug; then
    if ! $skip_es5_transform; then
        node app/scripts/package.js --debug
    else
        node --harmony app/scripts/package.js --debug
    fi
else
    if ! $skip_es5_transform; then
        node app/scripts/package.js
    else
        node --harmony app/scripts/package.js
    fi
fi

