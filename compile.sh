#!/bin/sh

# Get the Closure Compiler from http://code.google.com/p/closure-compiler/, and
# save it as compiler.jar.
# Get the Closure Library from https://developers.google.com/closure/library/
# and place it in closure-library, or run:
#   svn co http://closure-library.googlecode.com/svn/trunk/ closure-library

# Ubuntu 15.04 started setting JAVA_TOOL_OPTIONS, which makes Java echo a line
# to stdout when starting. The compiler determines Java version by parsing the
# output of `java -version`, and the extra line breaks it.
unset JAVA_TOOL_OPTIONS

tmp=$(mktemp -d)
closure-library/closure/bin/build/closurebuilder.py \
    --root=closure-library/ \
    --root=web/ \
    --namespace=bqbl \
    --output_mode=compiled \
    --compiler_jar=compiler.jar \
    -f "--js=closure-library/closure/goog/deps.js" \
    -f "--externs=firebase-externs.js" \
    -f "--compilation_level=ADVANCED_OPTIMIZATIONS" \
    -f "--warning_level=VERBOSE" \
    -f "--jscomp_error=checkTypes" \
    -f "--jscomp_error=checkVars" \
    > "${tmp}/bqbl-compiled.js" &&
    mv "${tmp}/bqbl-compiled.js" web/ &&
    wc -c web/bqbl-compiled.js

rm -r "${tmp}"
