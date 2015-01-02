echo Fetching dev repos related to Fora

get_repos_from_git() {
    curdir=`pwd`
    proj=$1
    basedir=$2
    if [ ! -d $basedir/$proj/.git ]; then
        echo cloning $basedir/$proj
        rm -rf $basedir/$proj
        git clone https://github.com/jeswin/$proj $basedir/$proj
        cd $basedir/$proj
        npm install
        cd $curdir
    else
        echo $basedir/$proj is already a git repo
    fi
}

get_repos_from_git "fora-build" "node_modules"
get_repos_from_git "fora-data-utils" "node_modules"
get_repos_from_git "calcify" "node_modules"
get_repos_from_git "calcify-backend-mongodb" "node_modules"
get_repos_from_git "calcify-validator" "node_modules"
get_repos_from_git "fora-extensions-service" "node_modules"
get_repos_from_git "fora-request" "node_modules"
get_repos_from_git "fora-request-parser" "node_modules"
get_repos_from_git "fora-router" "node_modules"
get_repos_from_git "fora-types-service" "node_modules"