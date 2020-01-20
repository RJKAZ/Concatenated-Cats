/*

HANDLE INITIALIZE PLAYER

*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// turn on spotify player
let player;

window.onSpotifyWebPlaybackSDKReady = () => {

  const token = getHashParams().access_token;

  player = new Spotify.Player({
    name: 'Web Player - Lyrics App',
    getOAuthToken: cb => {
      cb(token);
    }
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('authentication_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('account_error', ({ message }) => {
    console.error(message);
  });
  player.addListener('playback_error', ({ message }) => {
    console.error(message);
  });

  // Playback status updates
  player.addListener('player_state_changed', state => {
    // console.log(state);

    //so right now this shows whats currently playing according to player state BUT the play button doesnt work. on refresh we want it to clear what's currently playing. maybe do another function on pageload for that?
    setTimeout(function () {
      player.getCurrentState().then(function (playerState) {
        //console.log(playerState);
        playerDisplay(playerState);
        updateTrackMap(playerState);
        returnLyrics();
      });
    }, 1000);
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    playerId = device_id;
    setWebPlayer(device_id, access_token);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
  });

  // Connect to the player!
  player.connect();
};

// SET SPOTIFY WEB PLAYER TO BROWSER
function setWebPlayer(playerId, access_token) {
  //player.disconnect();
  $.ajax({
    url: "https://api.spotify.com/v1/me/player",
    method: "PUT",
    data: JSON.stringify({ "device_ids": [playerId] }),
    headers: {
      'Authorization': "Bearer " + access_token
    }
  })
    .then(function (response) {
      console.log(response);

    })
    .catch(function (err) {
      console.log(err);
    });
}