# lemmy-feeder
Pull RSS/Atom feeds and post to a Lemmy community

## Deploying
GHA workflow secrets required:
- `RESOURCE_PREFIX` - Used as a prefix for all AWS resources created.
- `LEMMY_URL` - Lemmy instance URL. No protocol, example: `lemmy.world`.
- `LEMMY_USER` - Lemmy username (or email) to sign in and post with.
- `LEMMY_PASS` - Password for the Lemmy user.

## Running
AWS Lambda event configuration example:
```
{
  "RSS_FEED": "https://rss.art19.com/apology-line",
  "COMMUNITY_ID": 783,
  "LANGUGAGE_ID": 37
}
```
