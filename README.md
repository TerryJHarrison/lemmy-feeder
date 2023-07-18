# lemmy-feeder
Pull RSS/Atom feeds and post to a Lemmy community

## Deploying
GHA workflow variables required:
- `AWS_DEPLOY_BUCKET` - S3 bucket name to use for SAM deploys
- `AWS_DEPLOY_REGION` - AWS region to deploy resources to
- `AWS_DEPLOY_ROLE` - AWS IAM role ARN for GitHub OIDC
- `AWS_RESOURCE_PREFIX` - Used as a prefix for all AWS resources created.
- `LEMMY_URL` - Lemmy instance URL. No protocol, example: `lemmy.world`.
- `LEMMY_USER` - Lemmy username (or email) to sign in and post with.

GHA workflow secrets required:
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
