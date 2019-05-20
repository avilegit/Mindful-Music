var recentlyPlayedFormatted;

(function() {

    $('#loggedin').hide();
    var params = GetHashParams();
    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if (error) {
        alert('There was an error during the authentication');
    } 
    else 
    {
        if (access_token) 
        {


            RenderUserInfo(access_token);

            //access recently played
            GetRecentlyPlayed(access_token);
            

        } 
    }
})();

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function GetHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

function RenderUserInfo(inAccess_Token) {
    // render oauth info
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + inAccess_Token
        },
        success: function(response) {
            document.getElementById('user-card').innerHTML = 
                '<img class="card-img-top" src=' + response.images[0].url + ' " ' + 'alt="Card image cap">' +
                '<div class="card text-white bg-dark mb-3">' + 
                    '<h1 class="card-title">'+ response.id +'</h4>' +
                    '<p class="card-position">' + response.display_name + '</p>' +
                    '<p class="card-position">' + 'followers: ' + response.followers.total + '</p>' +
                    '<a class="btn btn-outline-success" href="' + response.external_urls.spotify + ' " ' + '>Spotify</a>' +
                    '<p class="card-footer">' + response.country + '</p>'
        } 
    });
    $('#spotify-login').hide();
    $('#loggedin').show();
}

function GetRecentlyPlayed(inAccess_Token){
    $.ajax({
        url: 'https://api.spotify.com/v1/me/player/recently-played',
        data: {
            limit: 50
        },
        headers: {
            'Authorization': 'Bearer ' + inAccess_Token
        },
        async : false,
        success: function(response) {
            GetAudioFeatures(response, inAccess_Token);
        }
    });

}


function GetAudioFeatures(inRecentlyPlayed, inAccess_Token){

    var promises = [];

    for(var i = 0; i < inRecentlyPlayed.items.length; i++){
        song_id = inRecentlyPlayed.items[i].track.id;

        promises.push(GetSpotAudioFeatures(song_id, inAccess_Token, i).then(function(features){
            inRecentlyPlayed.items[features.index].features = features.payload;
        }));
    }
    Promise.all(promises).then(function(){
        console.log('all promises resolved');
        Parse_JSON(inRecentlyPlayed);
    }, function(err){

    });

    console.log('final loop',inRecentlyPlayed);
}

function GetSpotAudioFeatures(inTrackID, inAccess_Token, index){
    var def = $.Deferred();
    $.ajax({ 
        url: "https://api.spotify.com/v1/audio-features/" + inTrackID,
        type: "GET",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' + inAccess_Token
        },
        success: function(data){
            var response = {
                payload: data,
                index  : index
            }
            def.resolve(response)
        },
        error: function(){
            def.reject();
        }
    }); 
    return def.promise();
}

//send to python backend
function Parse_JSON(inRecentlyPlayed){

    dataPayload = {
        songs   : inRecentlyPlayed,
    }
    $.ajax({
        url: "/pythonFormat",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:  JSON.stringify(dataPayload),
        success: function(response){
            recentlyPlayedFormatted = JSON.parse(response)
            console.log('JSON incoming', recentlyPlayedFormatted);
            var metrics_idx = Object.keys(recentlyPlayedFormatted).length - 1
            metrics = recentlyPlayedFormatted[metrics_idx]
            delete recentlyPlayedFormatted[metrics_idx]
            console.log('metrics',metrics)
            bubbleChart(recentlyPlayedFormatted);
        },
        error: function(err){

        }
    });
}

