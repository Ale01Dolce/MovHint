# MovHint

MovHint will allow you to receive custom recommendations on what movies to watch, based on your tastes, and what you've already seen.

A live version is available [Here](https://movhint.pages.dev) if you wish to browse around freely.

## Quickstart
Below is specified every element in detail, but if you wish to get started as soon as possible, then follow these commands:

```sh
git clone https://github.com/Stefano-Palumbo/MovHint.git
cd MovHint/server
touch .env
nano .env
```

In the environment file just created, found in `MovHint/server/.env`, specify these variables, **without** mistyping:

```sh
MONGODB_LOGIN="A MongoDB connection String"
PRIVATE_KEY="Random string of bytes serving as private key"
MVDB_KEY="The Movie Database API Key"
FRONTEND_URL="The url where the frontend is located"
# With the command found later, it will start up as http://127.0.0.1:8000
RECOMMENDATIONS_URL="The url where the recommendation service is located"
GOOGLE_CLIENT_ID="Google Cloud OAuth client id"
```

in `MovHint/client/js/config.js`, specify where the NodeJS server is located:

```js
// By default, it will start up as http://localhost:3000
const API_URL = "The url where the NodeJs Express Server is located"
```

Adjust the login buttons so that they correspond to your credentials, for both Facebook Login:
```js
  window.fbAsyncInit = function () {
    FB.init({
      ***appId: 'Your Facebook App ID'***,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v15.0'
    });
```

And Google Login:
```html
<div 
    id="g_id_onload" 
    ***data-client_id="Your google client ID"***
    data-context="signin" 
    data-ux_mode="popup" 
    data-callback="handleCredentialResponse"
    data-auto_prompt="false">
</div>
```

Finally, in `MovHint/server`, install all the dependencies, initialize and start up the Server:

```sh
npm install
pip install -r requirements.txt

npm run first
npm run start

# You can specify whatever port you desire with the flag -p
# Make sure to update the configuration accordingly! 
python -m flask --app app --debug run -p 8000
```

## Installation

The source code for MovHint is available on [GitHub](https://github.com/Stefano-Palumbo/MovHint), which will allow you to host your version of the App. Before doing so, though, it's necessary to configure a few settings, since no database, nor hosting, is provided.
### Getting Started
First, make sure that [git](https://git-scm.com/) is installed and available, then clone the repository with the command:
```sh
git clone https://github.com/Stefano-Palumbo/MovHint.git
```

Then, cd into it:
```sh
cd MovHint
```

### Server Setup
MovHint uses two separate servers, a [NodeJS](https://nodejs.org/en/)](https://nodejs.org/en/) for the main API, and a secondary [Python Flask](https://palletsprojects.com/p/flask/) instance for managing recommendations.

First install all the required dependencies, by running:
```sh
npm install
pip install -r requirements.txt
```

You might also want to use Virtual Environments for Python, as outlined [here](https://docs.python.org/3/library/venv.html).

To provide the Servers with the correct configuration, create a .env file in the Server folder. It is going to contain various private keys, so make sure to never share it around!
```sh
touch .env
```

Afterward, define the necessary variables in it, while making sure **NOT** to mistype the names:

#### MongoDB Database
Since the data is stored using [Mongoose](https://mongoosejs.com/), a typical MongoDB ORM, you need to provide a connection string to a MongoDB Compatible Database. Atlas provides a free tier on their [website](https://www.mongodb.com/), otherwise, Microsoft also offers 25Gb with their CosmosDB service [for free](https://learn.microsoft.com/en-us/azure/cosmos-db/free-tier).

```sh
MONGODB_LOGIN='your-mongoDB-connection-string'
```

#### Private Key
The access tokens are signed and verified using the [jwt](https://jwt.io/) protocol, which requires a private key. A random sequence of bytes is usually enough, although, if you wish, you can generate your own [here](https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx).

```sh
PRIVATE_KEY='your-private-key'
```

#### Private Key
MovHint uses a third-party service for gathering specific details about the movies, called [The Movie Database](https://www.themoviedb.org/). As such, an API key for this service is necessary for the Web App to work properly, and it can easily be obtained by creating an account for free.

```sh
MVDB_KEY='your-mvdb-api-key'
```
#### Frontend URL
A few requests expect a redirect to a specific page as a response, therefore, since we are unable to determine where you'll host the service, you have to provide one. The visual studio code [live server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) usually hosts on http://localhost:5000, although the URL can vary wildly depending on the setup.

```sh
# This is the 'default' value, make sure it corresponds to your setup!
FRONTEND_URL='http://localhost:5000'
```

#### Google client ID
MovHint doesn't handle authentication (and therefore sensitive data) by itself but exclusively uses other services to do so, such as Google and Facebook Login. Because of that, a google client id is necessary, which can be obtained by following this [guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

```sh
# This is the 'default' value, make sure it corresponds to your setup!
GOOGLE_CLIENT_ID="your-google-client-id"
```
#### Recommendations URL
Lastly, you also have to specify where you'll be hosting the Flask recommendation service. 

```sh
# This is the 'default' value, make sure it corresponds to your setup!
RECOMMENDATIONS_URL="http://127.0.0.1:8000"
```
### Server Startup
Once you have specified everything, you'll be able to start everything up.
First, initialize the database with popular movies by running the following command:
```sh
npm run first
```

Then start the Express server by running:
```sh
npm run start
```

Finally, start the Flask instance by running:
```sh
# You can specify whatever port you desire with the flag -p
# Make sure to update the configuration accordingly! 
python -m flask --app app --debug run -p 8000
```

### Frontend Setup
The Front End can be found in the **client** folder, and only requires a few settings to be adjusted.

#### Config.js
The file in `client/js/config.js` has to be adjusted, specifically:
```js
const API_URL = "http://localhost:3000/api"
```
requires the URL for where the nodeJS Express server is hosted. By default, express runs on port 3000, but, if the configuration was changed for any reason, then the client also has to be fixed. Be mindful of the fact that the API server, by convention, registers the handlers with the path `/api` affixed, so don't forget to add it as well!

#### login.html
The login page also has to be adjusted, since, by default, it uses the Main App ids, which are not going to work for any origin except `movhint.pages.dev`. Specifically, you have to fix the FB App ID:
```js
  window.fbAsyncInit = function () {
    FB.init({
      appId: 'Your Facebook App ID',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v15.0'
    });
```
which can be obtained on the [Facebook developer portal](https://developers.facebook.com/apps/), and the Google Login Button:

```html
<div 
    id="g_id_onload" 
    ***data-client_id="Your google client ID"***
    data-context="signin" 
    data-ux_mode="popup" 
    data-callback="handleCredentialResponse"
    data-auto_prompt="false">
</div>
```

Make sure that the correct origins are also specified in their respective developer consoles.

## Frontend Startup

Now you will be able to properly use the Front End as well, using whatever Static file server you prefer!

## Deployment
If you wish to do so, you can deploy the service on the internet. While we cannot provide a comprehensive guide for every single cloud service out there, we **can** suggest a few noteworthy ones, specifically:

- [Google App Engine](https://cloud.google.com/appengine), Provided by Google, has a free tier and can be used for the NodeJS Server

- [Python Anywhere](https://www.pythonanywhere.com/), Provided by Anaconda, has a free tier that is enough to deploy the Flask Recommendations service

- [Cloudflare Pages](https://www.cloudflare.com/products/pages/), Provided by Cloudflare, has a free tier that allows the deployment of static Websites to their global CDN.


# Have Fun!