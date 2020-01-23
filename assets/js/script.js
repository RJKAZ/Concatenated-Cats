/*

HANDLE INTERACTING WITH THE PAGE AND WITH OTHER SCRIPTS

*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//DOM VARIABLES
var $categorySelect = document.querySelector("#category-select"); //refers to the select form element

var $selectDiv = document.querySelector("#select-genre");
var $displayBody = document.querySelector(".core-body");
var $playerDiv = document.querySelector(".player-wrapper");

var $lyricBox = document.querySelector("#lyricbox");


//music controls
var $playBtn = document.querySelector("#play-button");
var $prevBtn = document.querySelector("#prev-button");
var $nextBtn = document.querySelector("#next-button");

//for displaying current track
var $albumArtSlot = document.querySelector("#albumart-now");
var $trackArtistSlot = document.querySelector("#artist-now");
var $trackTitleSlot = document.querySelector("#title-now");

//for displaying tracks
var $queuedTracks = document.querySelector("#playedbox");

//checking screen size
var smallScreen = window.matchMedia("(max-width: 750px)");
var largeScreen = window.matchMedia("(min-width: 1600px)");

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//OTHER VARIABLES
var currentSong;
var currentArtist;

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//AJAX CALLS
function getCategories(){
  $.ajax({
    //we dont need any special parameters to get categories
    url: "https://api.spotify.com/v1/browse/categories",
    headers: {
      //for authorizing logged in user
      'Authorization': 'Bearer ' + access_token
    }
  }).then(function (categoriesResponse) {
    //console.log(categoriesResponse);
    var categoriesList = categoriesResponse.categories.items;
    //console.log(categoriesResponse.categories.items);

    categoriesList.forEach(function (category) {
      //for each category we create an option and add it to the category select form element
      var $categoryOption = document.createElement("option");
      $categoryOption.textContent = category.name;
      //console.log(categoriesList.name);
      $categoryOption.setAttribute("value", category.id);

      //append to select
      $categorySelect.appendChild($categoryOption);
    });
  });
}

function getCategorysPlaylists(categoryId) {
  $.ajax({
    url: `https://api.spotify.com/v1/browse/categories/${categoryId}/playlists`,
    headers: {
      //for authorizing logged in user
      'Authorization': 'Bearer ' + access_token
    }
  }).then(function (playlistsResponse) {
    //lets get the uri of a random playlist for now, maybe later we will let user specify:
    var randomIndex = Math.floor(Math.random() * (playlistsResponse.playlists.items).length);
    //console.log(playlistsResponse.playlists.items[randomIndex]);
    var playlistUri = playlistsResponse.playlists.items[randomIndex].uri;

    //we want to send the playlist to the player
    playPlaylist(playlistUri);
  });
}

function playPlaylist(playlistUri) {
  //console.log(playlistUri);
  $.ajax({
    url: `https://api.spotify.com/v1/me/player/play?device_id=${playerId}`,
    method: "PUT",
    data: JSON.stringify({
      'context_uri': playlistUri
    }),
    headers: {
      'Authorization': "Bearer " + access_token
    }

  }).then(function (playerResponse) {
    //when we send the playlist we want to display its data to the page.
    //here let's get information about the player's current state
    //if we wanna show more playlist data later we can send that in too
    //console.log(playerResponse);
    setTimeout(function () {
      player.getCurrentState().then(function (playerState) {
        //console.log(playerState);
        playerDisplay(playerState);
        $displayBody.classList.remove("hide");
        $playerDiv.classList.remove("hide");
      });
    }, 1000);
    $playBtn.setAttribute("data-state", "play");
    //$playBtn.classList.remove("fa-play");
    //$playBtn.classList.add("fa-pause");
  });
}

function resumeTrack() {
  $.ajax({
    url: `https:///api.spotify.com/v1/me/player/play?device_id=${playerId}`,
    method: "PUT",
    headers: {
      'Authorization': "Bearer " + access_token
    }
  }).then(function (playResponse) {
    $playBtn.setAttribute("data-state", "play");
    //$playBtn.classList.remove("fa-play");
    //$playBtn.classList.add("fa-pause");
  });
}

function pauseTrack() {
  $.ajax({
    url: `https:///api.spotify.com/v1/me/player/pause?device_id=${playerId}`,
    method: "PUT",
    headers: {
      'Authorization': "Bearer " + access_token
    }
  }).then(function (pauseResponse) {
    $playBtn.setAttribute("data-state", "pause");
    // $playBtn.classList.remove("fa-pause");
    // $playBtn.classList.add("fa-play");
  });
}
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//OTHER FUNCTION

function updateTrackMap(playerState){
  //so just a heads up getcurrentstate only shows next two and prev two songs. if we want to display more we will have to display thru getplaylist instead

  $queuedTracks.textContent = "";
  console.log("change");
  //we will add previous tracks (if any), current track, and next tracks
  (playerState.track_window.previous_tracks).forEach(function(prevTrack){
    //create new previous track div
    var $prevTrack = document.createElement("div");
    //give the div appropriate attributes
    $prevTrack.classList.add("past-track");
    $prevTrack.setAttribute("data-uri", prevTrack.uri);

    //add the title and artist
    var $ptTitle = document.createElement("div");
    $ptTitle.classList.add("playlist-title");
    $ptTitle.textContent = prevTrack.name;

    var $ptArtist = document.createElement("div");
    $ptArtist.classList.add("playlist-artist");
    $ptArtist.textContent = prevTrack.artists[0].name;
    
    //append the content to the div
    $prevTrack.appendChild($ptTitle);
    $prevTrack.appendChild($ptArtist);

    //append the content to the tracks display div
    $queuedTracks.appendChild($prevTrack);
  });

  //current song stuff
  //create new current track div
  var $currTrack = document.createElement("div");
      //give the div appropriate attributes
  $currTrack.classList.add("current-track");
  $currTrack.setAttribute("data-uri", playerState.track_window.current_track.uri);

    //add the title and artist
  var $ctTitle = document.createElement("div");
  $ctTitle.textContent = currentSong;
  $ctTitle.classList.add("playlist-title");

  var $ctArtist = document.createElement("div");
  $ctArtist.textContent = currentArtist;
  $ctArtist.classList.add("playlist-artist");
    //append the content to the div
  $currTrack.appendChild($ctTitle);
  $currTrack.appendChild($ctArtist);

    //append the content to the tracks display div
  $queuedTracks.appendChild($currTrack);

  //next song stuff... we can create a function to format stuff for both prev and next song stuff if we want to save code
  //create new next track div
  (playerState.track_window.next_tracks).forEach(function(nextTrack){
    var $nextTrack = document.createElement("div");
    //give the div appropriate attributes
    $nextTrack.classList.add("next-track");
    $nextTrack.setAttribute("data-uri", nextTrack.uri);

    //add the title and artist
    var $ntTitle = document.createElement("div");
    $ntTitle.classList.add("playlist-title");
    $ntTitle.textContent = nextTrack.name;

    var $ntArtist = document.createElement("div");
    $ntArtist.classList.add("playlist-artist");
    $ntArtist.textContent = nextTrack.artists[0].name;

    //append the content to the div
    $nextTrack.appendChild($ntTitle);
    $nextTrack.appendChild($ntArtist);

    //append the content to the tracks display div
    $queuedTracks.appendChild($nextTrack);
  });
}

function playerDisplay(playerState) {
  console.log(playerState);
  //set current song
  currentSong = playerState.track_window.current_track.name;
  //display current song
  $trackTitleSlot.textContent = currentSong;

  //set current artist
  currentArtist = playerState.track_window.current_track.artists[0].name;
  $trackArtistSlot.textContent = currentArtist; //hardcoding first index for now... maybe change to concatenate all with a for each or for loop
  
  console.log(playerState.track_window.current_track.album);
  //0 med, 1 is small, 2 is large
  $albumArtSlot.setAttribute("data-smallArt", playerState.track_window.current_track.album.images[1].url);
  $albumArtSlot.setAttribute("data-medArt", playerState.track_window.current_track.album.images[0].url);
  $albumArtSlot.setAttribute("data-largeArt", playerState.track_window.current_track.album.images[2].url);
  $albumArtSlot.setAttribute("alt", currentArtist + "'s Album: " + playerState.track_window.current_track.album.name);
  smallScreenArtCheck(smallScreen);
}

function selectCategory(){
  getCategorysPlaylists($categorySelect.value);
}

function handlePlayPause(){
  var playBtnState = $playBtn.getAttribute("data-state");
    //we might also want to do a check where we see if track is currently playing and update the icon accordingly... right now when i connect it plays on default but the button doesn't match up. it should be fine when we select a track from the page but we could add code to make sure
    //here we just toggle the icon on click
    if(playBtnState == "play"){
      //change it to pause
      pauseTrack();
    }else if(playBtnState == "pause"){
      //change it to play
      resumeTrack();
    }
}

function skipPrevSong(){
  player.previousTrack();
  //since the player state is updating we shouldnt need to call anything else here
}

function skipNextSong() {
  player.nextTrack();
}

function smallScreenArtCheck(screenCheck){
  if (screenCheck.matches){
    var imgSrc = $albumArtSlot.getAttribute("data-medArt");
    $albumArtSlot.setAttribute("src", imgSrc);
  } else {
    largeScreenArtCheck(largeScreen);
  }
}

function largeScreenArtCheck(screenCheck){
  if (screenCheck.matches){
    var imgSrc = $albumArtSlot.getAttribute("data-largeArt");
    $albumArtSlot.setAttribute("src", imgSrc);
  } else {
    medScreenArtCheck();
  }
}

function medScreenArtCheck(){
  var imgSrc = $albumArtSlot.getAttribute("data-medArt");
    $albumArtSlot.setAttribute("src", imgSrc);
}

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// EVENT LISTENERS
$prevBtn.addEventListener("click", skipPrevSong);
$nextBtn.addEventListener("click", skipNextSong);

$playBtn.addEventListener("click", handlePlayPause);
$categorySelect.addEventListener("change", selectCategory);

smallScreen.addEventListener("change", function(){
  smallScreenArtCheck(smallScreen);
});
largeScreen.addEventListener("change", function(){
  smallScreenArtCheck(smallScreen);
});

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//on pageload, get categories:
getCategories();
