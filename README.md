# Node.js Cloud Events Function

Welcome to your new Node.js function project! This function responds to [Cloud Events](https://cloudevents.io/)
by sending the data received to a Telegram Bot

## API Secret

The function depends on a Telegram API, which can be obtained via the Bot Father. The function will use
the value in a Kubernetes `Secret` called `telegram`. Set that value like this.

```
❯ kubectl create secret generic telegram --from-literal=API_KEY=[YOUR API KEY]
```
