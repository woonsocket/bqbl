Scrapes NFL.com Game Center JSON play-by-play data.

## First-time setup
cd {PATH}/bqbl
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt

## Regular Use
To run the scraper for the current week:

```
python3 scrape.py --firebase_creds=../private-keys/BQBL-firebase.json
```

You'll first need to obtain Firebase service account credentials. Please put
them somewhere that is gitignore'd.
