const https = require('https');
const Parser = require('rss-parser');
const parser = new Parser();

const post = (path, payload) => new Promise((resolve, reject) => {
    const options = { ...{
      host: process.env.LEMMY_URL,
      port: 443,
      headers: {
          'Content-Type': 'application/json',
      }
    }, path, method: 'POST' };
    
    const req = https.request(options, res => {
        let buffer = "";
        res.on('data', chunk => buffer += chunk)
        res.on('end', () => resolve((buffer)))
    });
    req.on('error', e => reject(e));
    req.write(JSON.stringify(payload));
    req.end();
});

exports.handler = async function(event) {
    console.log("Logging in with user: " + process.env.LEMMY_USER);
    let auth = JSON.parse(await post('/api/v3/user/login', {
        username_or_email: process.env.LEMMY_USER,
        password: process.env.LEMMY_PASS
    }));

    console.log("Pulling current posts for community: " + event.COMMUNITY_NAME);
    let currentPosts = await parser.parseURL('https://' + process.env.LEMMY_URL + '/feeds/c/' + event.COMMUNITY_NAME + '.xml?sort=New');
    let postTitles = currentPosts.items.map(post => post.title);

    console.log("Loading feed: " + event.RSS_FEED);
    let feed = await parser.parseURL(event.RSS_FEED);
    console.log("Populating from " + feed.title + " for last 8 hours");
    let postsToCreate = [];
    feed.items.forEach(item => {
        //Prevent reposts based on title
        if(!postTitles.includes(item.title)){
            //Create a post promise for each new entry
            postsToCreate.push(post('/api/v3/post', {
                name: item.title,
                community_id: event.COMMUNITY_ID,
                language_id: event.LANGUAGE_ID,
                url: item.link,
                body: item.contentSnippet,
                auth: auth.jwt
            }));
        }
    });
    console.log("Creating " + postsToCreate.length + " posts");
    const response = await Promise.all(postsToCreate);
    console.log(response);
  
    return {
        statusCode: 200,
        message: "OK"
    }
};
