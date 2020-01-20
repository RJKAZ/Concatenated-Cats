//lyric parameters

var lyricQueryURL = `https://api.lyrics.ovh/v1/`

function returnLyrics(){
    $lyricBox.textContent = "";
    $.ajax({
        url: lyricQueryURL + currentArtist + "/" + currentSong,
        method: "GET"
    }).then(function (lyricResponse) {
        
        $lyricBox.textContent = lyricResponse.lyrics;
        //let's also display a message when this search returns nothing
    });

}