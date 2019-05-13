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
            
            //Read JSON
            $.getJSON("/sample/tracks.json", function(json) {
                console.log('got json', json);

                //Display_Graph(json);
            });

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
            console.log(response);

            document.getElementById('user-card').innerHTML = 
                '<img class="card-img-top" src=' + response.images[0].url + ' " ' + 'alt="Card image cap">' +
                '<div class="card text-white bg-dark mb-3">' + 
                    '<h1 class="card-title">'+ response.id +'</h4>' +
                    '<p class="card-position">' + response.display_name + '</p>' +
                    '<p class="card-position">' + 'followers: ' + response.followers.total + '</p>' +
                    '<a class="btn btn-outline-success" href="' + response.external_urls.spotify + ' " ' + '>Spotify</a>' +
                    '<p class="card-footer">' + response.country + '</p>'
                '</div>'
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
            Parse_JSON(response, inAccess_Token);
            //Display_Graph(response);
        }
    });
}

function Display_Graph(inJson){
    console.log(inJson);
}

function Parse_JSON(inRecentlyPlayed, inAccess_Token){

    console.log('logging json', inRecentlyPlayed)
    $.ajax({
        url: "/pythonFormat",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(inRecentlyPlayed),
 
        success: function(response){
            console.log('incoming', response);
            console.log('JSON incoming', JSON.parse(response));
    
        },
        error: function(err){
            //var returned = JSON.parse(err);
            //console.log('error', returned);
        }
    });


}