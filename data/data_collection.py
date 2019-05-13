import spotipy
import spotipy.util as util
import pandas as pd
import json
import sys

class Recents:
    def __init__(self, inJson, inToken):

        print('test', inJson[0]['track'])
        spotify = spotipy.Spotify(auth=inToken)

        recently_played = inJson
        row_list = []

        for items in recently_played:
            song = {}
            song['track_id'] = items['track']['id']
            song['name'] = items['track']['name']
            song['artist'] = items['track']['artists'][0]['name']
            song['artist_id'] = items['track']['artists'][0]['id']
            song['popularity'] = items['track']['popularity']

            # features = spotify.audio_features(song['track_id'])
            # if features[0] is not None:
            #     song['energy'] = features[0]['energy']
            #     song['dance'] = features[0]['danceability']
            #     song['liveness'] = features[0]['liveness']
            #     song['valence'] = features[0]['valence']
            #     song['tempo'] = features[0]['tempo']
            #     song['instrumental'] = features[0]['instrumentalness']
            #     song['duration'] = features[0]['duration_ms']
            #     song['key'] = features[0]['key']
            #     song['mode'] = features[0]['mode']
            #     song['time_signature'] = features[0]['time_signature']
            
            # search_lyrics = genius.search_song(song['name'], song['artist'])
            # if search_lyrics is not None and (search_lyrics.title.lower() == song['name'].lower()
            #                                  or search_lyrics.artist.lower() == song['artist'].lower()):
            #     song['lyrics'] = search_lyrics.lyrics
            #     print(search_lyrics)

            row_list.append(song)
        
        self.recently_played = pd.DataFrame(row_list)
        print('check',self.recently_played)
        self.recently_played.to_json('last_50_with_lyrics.json')
        self.recently_played.to_csv('last_50_with_lyrics.csv')

    
    def get_max_feature(self, feature):
        return(max(self.recently_played[feature]))

    def get_min_feature(self, feature):
        return(min(self.recently_played[feature]))

    def get_mean_feature(self, feature):
        return(self.recently_played[feature].mean())

    def get_median_feature(self, feature):
        return(self.recently_played[feature].mean())

    def get_boxplot_feature(self, feature):
        return(self.recently_played.boxplot(column=[feature]))



#Read data from stdin
def read_in():
    recentlyPlayedString = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(recentlyPlayedString[0])

def main():
    #get our data as an array from read_in()
    recentlyPlayedJSON = read_in()
    Recents(recentlyPlayedJSON, 'fqfq')

    print(recentlyPlayedJSON)

#start process
if __name__ == '__main__':
    main()