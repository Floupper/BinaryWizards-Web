## Prerequisites
Before you can run the Web project, which is the web quiz application, you need to ensure you have an API.
You can either work locally with the API and the web app, or use a remote API.
In this case, you have two options:

Local API
Remote API

For the local API, you need to install the API project.
For the remote API, no installation is required, you just need to know the IP address or URL of your API.

## Installation
```
git clone <project_remote_URL>
```

You need to navigate to the project folder.
```
cd binarywizards-webapp/
```

Before launching the API, you need to create a *.env* file containing the following information:
```
REACT_APP_PORT=33034

REACT_APP_API_BASE_URL=https://klebert-host.com:33012/

key=/home/container/certificat.key
cert=/home/container/certificat-privkey.cert
```

You can install the dependencies and launch the application with the following commands:
```
npm install
npm start
```


