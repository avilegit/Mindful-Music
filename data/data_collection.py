import spotipy
import spotipy.util as util
import pandas as pd
import json
import sys

class Recents:
    def __init__(self, inSongs):

        recently_played = inSongs
        row_list = []

        for items in recently_played:
            song = {}
            song['track_id']   = items['track']['id']
            song['name']       = items['track']['name']
            song['artist']     = items['track']['artists'][0]['name']
            song['artist_id']  = items['track']['artists'][0]['id']
            song['popularity'] = items['track']['popularity']
            song['image']      = items['track']['album']['images'][0]['url']
            song['plays']      = 1
            song['valid']      = items['valid']

            features = items['features']
            if len(features) is not 0:
                song['energy']          = features['energy']
                song['dance']           = features['danceability']
                song['liveness']        = features['liveness']
                song['valence']         = features['valence']
                song['tempo']           = features['tempo']
                song['instrumental']    = features['instrumentalness']
                song['duration']        = features['duration_ms']
                song['key']             = features['key']
                song['mode']            = features['mode']
                song['time_signature']  = features['time_signature']

            repeat = next((i for i,d in enumerate(row_list) if song['track_id'] in d.values()),None)
            if repeat is not None:
                row_list[repeat]['plays'] +=1
            elif song['valid'] is True:
                row_list.append(song)

        recently_played = pd.DataFrame(row_list)
        self.mean_feature = recently_played.mean(axis = 0)
        row_list.append(self.mean_feature)
        
        self.recently_played = pd.DataFrame(row_list)
        recently_played_json = self.recently_played.to_json(orient = 'index')

        print(recently_played_json)
    
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
    Recents(recentlyPlayedJSON['songs'])

#start process
if __name__ == '__main__':
    main()