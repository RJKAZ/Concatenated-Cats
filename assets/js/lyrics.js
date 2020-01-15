//lyric parameters

var queryURL = `https://api.lyrics.ovh/v1/`
var artist = "coldplay";
var title = "clocks";

$.ajax({
    url:  queryURL + artist + "/" + title,
    method: "GET"
}).then(function(response){
    console.log(response);

    //Artist
    
    var Coldplay = $("<p>").text("Coldplay: " + response.lyrics);

   
    $("#artists").prepend(Coldplay);
});


// Genre selector dropdown list