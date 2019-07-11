const functions = require('firebase-functions');
const request = require('request-promise');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer 8g/pRUE7EmjqCMoK/NOXlVONXYy3w/eIDQJHSol8kcBo3D1wFD7LiSY4k+pexT840VhvZJsDjAqCybLiBJTPcVpR5r7UD31xUbSnN/ykH5P/HNciJcgiMuJi3FtA/0iF1ZQ6Etk/+s2iA6Ynwnkw7wdB04t89/1O/w1cDnyilFU=`
};

exports.webhook = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    let event = req.body.events[0]
    if (event.type === "message" && event.message.type === "text") {
      postToDialogflow(req);
    } else {
      reply(req);
    }
  }
  return res.status(200).send(req.method);
});

const reply = req => {
  return request.post({
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [
        {
          type: "text",
          text: JSON.stringify(req.body)
        }
      ]
    })
  });
};

const postToDialogflow = req => {
  req.headers.host = "bots.dialogflow.com";
  return request.post({
    uri: "https://bots.dialogflow.com/line/f8fde24e-fca4-4e93-a8ed-a65b87561e3d/webhook",
    headers: req.headers,
    body: JSON.stringify(req.body)
  });
};