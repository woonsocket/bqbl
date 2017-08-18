Scrapes ESPN box score HTML.

This scraper is pretty much deprecated.

To run for week `$WEEK`:

```
python bqbl-scrape.py nfl-week$WEEK.txt corrections-week$WEEK.json \
    --passer_db passers.txt \
    -o json \
    > week$WEEK.json
```

The input files:

*   `nfl-week$WEEK.txt`: A list of ESPN game IDs, one per line.
*   `corrections-week$WEEK.json`: A JSON object of corrections to apply to the
    scraped data.
*   `passers.txt`: A cache of ESPN player IDs mapped to their field position
    (QB, WR, etc.). You can use an empty file here, and it will be populated
    during the scrape.
