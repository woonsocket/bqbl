#!/bin/sh

# Get the Closure Library from https://developers.google.com/closure/library/
# and place it in third_party/closure-library.

java -jar third_party/closure-compiler/closure-compiler-v20170806.jar \
    --js="third_party/closure-library/**.js" \
    --js="web/bqbl.js" \
    --dependency_mode="STRICT" \
    --entry_point="bqbl" \
    --externs="firebase-externs.js" \
    --compilation_level="ADVANCED_OPTIMIZATIONS" \
    --warning_level="VERBOSE" \
    --jscomp_error="checkTypes" \
    --jscomp_error="checkVars" \
    --js_output_file="web/bqbl-compiled.js" &&
    wc -c web/bqbl-compiled.js
