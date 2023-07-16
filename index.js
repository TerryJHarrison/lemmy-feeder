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
  let feed = await parser.parseURL(event.RSS_FEED);
  console.log("Populating from " + feed.title + " for last 8 hours");

  let postsToCreate = [];
  feed.items.forEach(item => {
    //TODO: de-duplicate from existing posts
    //create a post promise for each item
    postsToCreate.push(post('/api/v3/post', {
      name: item.title,
      community_id: event.COMMUNITY_ID,
      language_id: event.LANGUAGE_ID,
      url: item.link,
      body: item.content,
      auth: process.env.LEMMY_JWT
    }));
  });
  console.log("Creating " + postsToCreate.length + " posts");
  const response = await Promise.all(postsToCreate);
  console.log(response);
  
  return {
    statusCode: 200,
    message: "OK"
  }
};
