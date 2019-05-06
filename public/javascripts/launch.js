(function() {

    $('#loggedin').hide();

    /**
     * Obtains parameters from the hash of the URL
     * @return Object
     */
    function getHashParams() {
      var hashParams = {};
      var e, r = /([^&;=]+)=?([^&;]*)/g,
          q = window.location.hash.substring(1);
      while ( e = r.exec(q)) {
         hashParams[e[1]] = decodeURIComponent(e[2]);
      }
      return hashParams;
    }

    var params = getHashParams();

    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

        if (error) {
            alert('There was an error during the authentication');
          } else {
            if (access_token) {
              // render oauth info
  
                $.ajax({
                    url: 'https://api.spotify.com/v1/me',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function(response) {
                        console.log(response);
                        console.log(response.images[0].url);

                        document.getElementById('user-card').innerHTML = //'<img class="card-img-top" src=' + response.images[0].url +  'alt="Card image cap">' +
                            '<div class="card-block">' + 
                                '<h4 class="card-title">'+ response.id +'</h4>' +
                                '<p class="card-position">' + response.display_name + '</p>' +
                                '<p class="card-position">' + 'followers: ' + response.followers.total + '</p>' +
                                '<a href="' + response.external_urls.spotify + ' " ' + '>Spotify</a>' +
                                '<p class="card-footer">' + response.country + '</p>'
                            '</div>'
                    } 
                });
                $('#spotify-login').hide();
                $('#loggedin').show();

                $.ajax({
                    url: 'https://api.spotify.com/v1/me/player/recently-played',
                    data: {
                        limit: 50
                    },
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                    },
                    success: function(response) {
                        console.log('recently played', response);
                    } 
                });

            

            } 
        }
})();
