var topTracks = function(inTopTracks, inInterpretations)
{
    if(inTopTracks.length)
    {
        $('.list-group').append("<li class='list-group-item list-group-item flex-column align-items-start text-white bg-dark'>"+
                                        '<h2 class="mb-1"> Your Top Tracks </h2>' + '<br>' +
                                        '<div class="card text-white bg-dark mb-3">' + 
                                            '<div class="card-header">' + 
                                                '<h4> Musical Breakdown </h4>' +                                           
                                            '</div>'+


                                            '<div class="card-body">' + 
                                                '<div class="d-flex w-100 justify-content-between">'+
                                                    '<p class="card-position">' + 'Popularity: ' + inInterpretations.popVal + '%  ' +'<br>' +  inInterpretations.popularity + '  ' + '<font size="5">'+ inInterpretations.popularityImage + '</font> </p>' +
                                                    '<p class="card-position">' + 'Energy: ' + Math.round(inInterpretations.energyVal*100) + '%  ' +'<br>' + inInterpretations.energy + '  ' + '<font size="5">' + inInterpretations.energyImage + '</font> </p>' +
                                                    '<p class="card-position">' + 'Danceability: ' + Math.round(inInterpretations.danceVal*100) + '%  ' +'<br>' + inInterpretations.dance + '  ' + '<font size="5">' +inInterpretations.danceImage + '</font> </p>' +
                                                    '<p class="card-position">' + 'Positivity: ' + Math.round(inInterpretations.valenceVal*100) + '%  ' +'<br>' + inInterpretations.valence + '  ' + '<font size="5">' +inInterpretations.valenceImage + '</font> </p>' +
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
            "</li>");

        for(var i in inTopTracks)
        {
            song = inTopTracks[i];
            var imgstring = '<img src=' + song.image +' " ' + 'height="250" width="250">';

            $('.list-group').append("<li class='list-group-item list-group-item flex-column align-items-start text-white bg-dark'>"+
                                    '<div class="card text-white bg-dark mb-3">' + 
                                        '<div class="d-flex w-120 justify-content-between">'+
                                            '<div class="card-header">' + 
                                                '<h5>'+ song.name +'</h5>' +
                                                '<p class="mb-1">' + song.artist +'</p>' +
                                                '<small>' + song.plays + ' plays'+ '</small>' +
                                            '</div>'+
                                        '</div>'+
                                        '<div class="card-body">' + 
                                            imgstring + 
                                        '</div>'+
                                    '</div>'+

            "</li>");
        }
    }
    else
    {
        $('.list-group').append("<li class='list-group-item list-group-item flex-column align-items-start text-white bg-dark'>"+
                                        '<h1 class="mb-1"> No Top Tracks Detected </h1>'+                   
                                 "</li>");
    }
}