/*

HANDLE INTERACTING WITH THE PAGE AND WITH OTHER SCRIPTS

*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//DOM VARIABLES
var $categorySelect = document.querySelector("#category-select"); //refers to the select form element
var $loginBtn = document.querySelector("#login-button");
var $playBtn = document.querySelector("#play-button");

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
    console.log(playlistsResponse.playlists.items[randomIndex]);
    var playlistUri = playlistsResponse.playlists.items[randomIndex].uri;

    //we want to send the playlist to the player
    playPlaylist(playlistUri);
  });
}

function playPlaylist(playlistUri) {
  console.log(playlistUri);
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
    $playBtn.setAttribute("data-state", "play");
    $playBtn.classList.remove("fa-play");
    $playBtn.classList.add("fa-pause");

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
    $playBtn.classList.remove("fa-play");
    $playBtn.classList.add("fa-pause");
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
    $playBtn.classList.remove("fa-pause");
    $playBtn.classList.add("fa-play");
  });
}
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//OTHER FUNCTIONS
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

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
// EVENT LISTENERS
$loginBtn.addEventListener("click", spotifyLogin); //this is in oauth file
$playBtn.addEventListener("click", handlePlayPause);
$categorySelect.addEventListener("change", selectCategory);

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
//on pageload, get categories:
getCategories();