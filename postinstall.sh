#!/bin/bash

cp pcmd.json ~/

path=`pwd`

pcmd=$path/pcmd.sh

printf "#!/bin/bash\nnode $path/index.js \"\$@\"" > $pcmd

sudo ln -s $pcmd /usr/bin/pcmd
