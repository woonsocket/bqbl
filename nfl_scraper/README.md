Scrapes NFL.com Game Center JSON play-by-play data.

To run the scraper for the current week:

```
python3 scrape.py --firebase_creds=../private-keys/BQBL-firebase.json --slack_config=../private-keys/slack-config.json
```

You'll first need to obtain Firebase service account credentials and a Slack
config file (see `slack.py` for format). Please put them somewhere that is
gitignore'd.
