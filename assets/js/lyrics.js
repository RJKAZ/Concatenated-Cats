//lyric parameters

var lyricQueryURL = `https://api.lyrics.ovh/v1/`

function returnLyrics(){
    $lyricBox.textContent = "";
    $.ajax({
        url: lyricQueryURL + currentArtist + "/" + currentSong,
        method: "GET",
        error: function(){
             //let's also display a message when this search returns nothing
            $lyricBox.textContent = `Sorry. We couldn't find any lyrics for "${(currentSong)}"`;
            //maybe add special styling here too
        }
    }).then(function (lyricResponse) {

        var lyricsFormat = (lyricResponse.lyrics).replace(/\n/g, "<br>");
        
        $lyricBox.innerHTML = lyricsFormat;
        //how will we format this to have a different line for each return

        //console.log(lyricResponse.lyrics);
       
    });

}