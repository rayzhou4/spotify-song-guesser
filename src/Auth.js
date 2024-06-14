const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = REACT_APP_REDIRECT_URI;

const generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const scope = "streaming user-read-email user-read-private"
const state = generateRandomString(16);
const auth_query_parameters = new URLSearchParams({
  response_type: "code",
  client_id: SPOTIFY_CLIENT_ID,
  scope: scope,
  redirect_uri: SPOTIFY_REDIRECT_URI,
  state: state
})

const LOGIN_URL = 'https://accounts.spotify.com/authorize?' + auth_query_parameters.toString();

const getTokenFromResponse = async () => {
  const url_params = new URLSearchParams(new URL(window.location.href).search);
  const code = url_params.get('code');
  const state = url_params.get('state');

  var auth_options = {
    method: 'POST',
    body: new URLSearchParams({
      code: code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code'
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET))
    }
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', auth_options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.error} - ${errorData.error_description}`);
    }
    
    const result = await response.json();
    return result.access_token;       

  } catch (error) {
    console.error('Error exchanging code for token:', error);
  }
}

export {
  SPOTIFY_REDIRECT_URI,
  LOGIN_URL,
  getTokenFromResponse,
}