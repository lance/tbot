const { CloudEvent, HTTP } = require('cloudevents');
const axios = require('axios');

const token = process.env.API_KEY;
const url = `https://api.telegram.org/bot${token}`;
const updates = `${url}/getUpdates`;
const sendMessage = `${url}/sendMessage`;

// Sanity check - we can't do anything without an API token
if (!token) {
  throw new Error('No $API_KEY found.');
}

/**
 * Your CloudEvent handling function, invoked with each request.
 * This example function logs its input, and responds with a CloudEvent
 * which echoes the incoming event data
 *
 * It can be invoked with 'func invoke'
 * It can be tested with 'npm test'
 *
 * @param {Context} context a context object.
 * @param {object} context.body the request body if any
 * @param {object} context.query the query string deserialzed as an object, if any
 * @param {object} context.log logging object with methods for 'info', 'warn', 'error', etc.
 * @param {object} context.headers the HTTP request headers
 * @param {string} context.method the HTTP request method
 * @param {string} context.httpVersion the HTTP protocol version
 * See: https://github.com/knative-sandbox/kn-plugin-func/blob/main/docs/guides/nodejs.md#the-context-object
 * @param {CloudEvent} event the CloudEvent
 */
function handle(context, event) {
  if (!context.cloudevent) {
    context.log.error('No CloudEvent received');
    return {
      message: 'No CloudEvent received'
    };
  }

  return new Promise((resolve, reject) => {
    // resolve immediately with HTTP 204 No Content
    resolve({ code: 204 });

    // Now, get the latest chat updates and send a new one
    axios.get(updates)
    .then(response => {
      const data = response.data
      if (!data.ok) {
        context.log.error(data)
        throw new Error(data)
      }
      // get the most recent message and extract the chat id
      const chat_id = data.result[0].message.chat.id;
      context.log.info(`Updating chat ${chat_id}`)
      // Send the event data to the chat
      return axios.post(sendMessage, {
        chat_id,
        text: event.data
      })
    })
    .catch(err => context.log.error(err));
  });
}

module.exports = { handle };
