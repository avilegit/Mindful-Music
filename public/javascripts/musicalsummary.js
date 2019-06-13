var energyStrings = ["'asleep'","'low'", "'moderate'", "'wired'", "'god-like'"]
const energyScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, energyStrings.length])

var energyImages = ['<i class="fas fa-bed"></i>','<i class="fas fa-volume-down"></i>' ,'<i class="fas fa-burn"></i>','<i class="fas fa-bomb"></i>']
const energyImageScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, energyImages.length])

var danceStrings = ["'impossible'","'little shuffle'", "'raving'", "'booty-shaking'"]
const danceScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, danceStrings.length])

var danceImages = ['<i class="fas fa-user-injured"></i>','<i class="fas fa-shoe-prints"></i>' ,'<i class="fas fa-running"></i>']
const danceImageScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, danceImages.length])

var valenceStrings = ["'straight depressed'","'moody'", "'so-so'","'feel-good'", "'optimistic'", "'pure sunshine'"]
const valenceScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, valenceStrings.length])

var valenceImages = ['<i class="far fa-meh"></i>','<i class="far fa-smile"></i>','<i class="fas fa-heart"></i>']
const valenceImageScale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, valenceImages.length])

var popularityStrings = ["'level 7 hipster'", "'you might have heard of them'", "'fresh'", "'radio-level'","'your mom's heard of them'"]
const popularityScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, popularityStrings.length])

var popularityImages = ['<i class="fas fa-glasses"></i>','<i class="fas fa-lemon"></i>' ,'<i class="fas fa-broadcast-tower"></i>']
const popularityImageScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, popularityImages.length])

var musicalsummary = function(data)
{
    var topTracksSize = 4;
    inTopTracks = [];
    topTracksCharacteristic = {};
    songObjects = Object.values(data)
    
    songObjects.sort(function(a,b){
        return b.plays - a.plays;
    })

    var avgEnergy       = 0;
    var avgDance        = 0;
    var avgValence      = 0;
    var avgInstrumental = 0;
    var avgLiveness     = 0;
    var avgPopularity   = 0;

    var totalPlays      = 0;

    for(var i in songObjects){
        song = songObjects[i];

        if(song.plays > 3){
            totalPlays      +=  song.plays;
            avgEnergy       +=  song.energy     * song.plays;
            avgDance        +=  song.dance      * song.plays;
            avgValence      +=  song.valence    * song.plays;
            avgInstrumental +=  song.valence    * song.plays;
            avgLiveness     +=  song.liveness   * song.plays;
            avgPopularity   +=  song.popularity * song.plays;

            inTopTracks.push(song)
        }

    }

    avgEnergy       /= totalPlays;
    avgDance        /= totalPlays;
    avgValence      /= totalPlays;
    avgLiveness     /= totalPlays;
    avgPopularity   /= totalPlays;

    topTracksCharacteristic.energy          = avgEnergy;
    topTracksCharacteristic.dance           = avgDance;
    topTracksCharacteristic.valence         = avgValence;
    topTracksCharacteristic.instrumental    = avgInstrumental;
    topTracksCharacteristic.liveness        = avgLiveness;
    topTracksCharacteristic.popularity      = Math.round(avgPopularity);


    var musicalInterpret = interpretCharacteristics(topTracksCharacteristic);
    topTracks(inTopTracks, musicalInterpret);
}

function interpretCharacteristics(inCharacteristics){

    var interprettedChars = {};

    var energyInterpretted      = energyStrings[stringIndex(energyScale,inCharacteristics.energy)];
    var energyImageInterpretted = energyImages[stringIndex(energyImageScale,inCharacteristics.energy)];

    var danceInterpretted       = danceStrings[stringIndex(danceScale,inCharacteristics.dance)];
    var danceImageInterpretted  = danceImages[stringIndex(danceImageScale,inCharacteristics.dance)];

    var valenceInterpretted     = valenceStrings[stringIndex(valenceScale,inCharacteristics.valence)];
    var valenceImageInterpretted    = valenceImages[stringIndex(valenceImageScale,inCharacteristics.valence)];

    var popInterpretted         = popularityStrings[stringIndex(popularityScale,inCharacteristics.popularity)];
    var popImageInterpretted    = popularityImages[stringIndex(popularityImageScale,inCharacteristics.popularity)];

    interprettedChars.energy            = energyInterpretted;
    interprettedChars.energyImage       = energyImageInterpretted;
    interprettedChars.energyVal         = inCharacteristics.energy;


    interprettedChars.dance             = danceInterpretted;
    interprettedChars.danceImage        = danceImageInterpretted;
    interprettedChars.danceVal          = inCharacteristics.dance;


    interprettedChars.valence           = valenceInterpretted;
    interprettedChars.valenceImage      = valenceImageInterpretted;
    interprettedChars.valenceVal        = inCharacteristics.valence;


    interprettedChars.popularity        = popInterpretted;
    interprettedChars.popularityImage   = popImageInterpretted;
    interprettedChars.popVal            = inCharacteristics.popularity;


    return interprettedChars;
}

function stringIndex(inScale,inFeature){
   return Math.round(inScale(inFeature) - 1) > 0 ? Math.round(inScale(inFeature)) - 1 : 0;
}
