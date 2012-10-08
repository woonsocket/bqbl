#!/bin/sh

# Get the Closure Compiler from http://code.google.com/p/closure-compiler/, and
# save it as compiler.jar.
# Get the Closure Library from https://developers.google.com/closure/library/
# and place it in closure-library, or run:
#   svn co http://closure-library.googlecode.com/svn/trunk/ closure-library

closure-library/closure/bin/build/closurebuilder.py \
    --root=closure-library/ \
    --root=bqbl-js/ \
    --namespace=bqbl \
    --output_mode=compiled \
    --compiler_jar=compiler.jar \
    -f "--js=closure-library/closure/goog/deps.js" \
    -f "--compilation_level=ADVANCED_OPTIMIZATIONS" \
    -f "--warning_level=VERBOSE" \
    -f "--jscomp_error=checkTypes" \
    -f "--jscomp_error=checkVars" \
    > bqbl-js/bqbl-compiled.js; wc -c bqbl-js/bqbl-compiled.js
