/* 

HANDLE OAUTH 

*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
var spotify_CLIENT = "909a31103cc74365a80f64ce534cca73";

let stateKey = 'spotify_auth_state';

// on load, try to pull access_token from URL parameters
// localhost:8000?access_token=[token]&state=[state]
const params = getHashParams();
//console.log(params);

// save access_token, state, and stored state into variables
let access_token = params.access_token,
  userId = "",
  playerId = "",
  state = params.state,
  storedState = localStorage.getItem(stateKey);

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  const hashParams = {};
  let e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window
      .location
      .hash
      .substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// if there's an access_token and state is either null OR doesn't equal stored
// state, then let user know there's an issue with authentication
if (access_token && (state == null || state !== storedState)) {
  //console.log("You need to login.");
  spotifyLogin();
} else {

  // if authentication is successful, remove item from localStorage
  localStorage.removeItem(stateKey);
  // if there's an access token, get user information
  if (access_token) {
    $
      .ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        }
      })
      .then(function (response) {
        //console.log("logged in");
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Logged in!',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }
}
// LOG INTO SPOTIFY
function spotifyLogin() {
  const client_id = spotify_CLIENT; // Your client id
  const redirect_uri = (location.hostname === "127.0.0.1") ? "http://127.0.0.1:5502" : 'https://rjkaz.github.io/Concatenated-Cats';

  // generate random state key
  const state = generateRandomString(16);

  // set state in localStorage (will read when we get it back)
  localStorage.setItem(stateKey, state);
  // Set scope for authentication privileges
  const scope = 'streaming user-read-private user-read-email user-read-playback-state user-read-currently-playing user-modify-playback-state';

  // build out super long url
  let url = 'https://accounts.spotify.com/authorize';
  url += '?response_type=token';
  url += '&client_id=' + encodeURIComponent(client_id);
  url += '&scope=' + encodeURIComponent(scope);
  url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
  url += '&state=' + encodeURIComponent(state);

  //console.log(url);
  // change pages and go to the spotify login page
  window.location = url;
}