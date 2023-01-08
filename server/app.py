#Test
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from os import environ
import json
import requests
from flask_cors import CORS

load_dotenv('./.env')
app = Flask(__name__)
CORS(app)
def get_movie_object(movieid: int) -> dict:

    initial = {}
    res = requests.get(f"https://api.themoviedb.org/3/movie/{movieid}?api_key={environ['MVDB_KEY']}&append_to_response=watch%2Fproviders%2Ccredits%2Calternative_titles%2Cimages%2Ckeywords")
    jsonres = json.loads(res.text)
    # print(jsonres)
    get_movie_details(jsonres, initial)
    get_movie_keywords(jsonres['keywords'], initial)
    get_movie_cast(jsonres['credits'], initial)

    return jsonres, initial

def get_movie_cast(data, initial):
    initial['cast'] = [i['name'] for i in data['cast']]
    initial['cast'] += [i['name'] for i in data['crew']]

def get_movie_keywords(data, initial):
    initial['keywords'] = [i['name'] for i in data['keywords']]

def get_movie_details(data, initial):
    initial['desc'] = data['overview']
    initial['title'] = data['title']
    initial['genres'] = [i['name'] for i in data['genres']]

def clean_data(x):
    if isinstance(x, list):
        return [str.lower(i.replace(" ", "")) for i in x]
    else:
        #Check if director exists. If not, return empty string
        if isinstance(x, str):
            return str.lower(x.replace(" ", ""))
        else:
            return ''


def get_soup(raw_data):
    elem = []
    elem.append(' '.join(clean_data(raw_data['keywords'])))
    elem.append(' '.join(clean_data(raw_data['cast'])))
    elem.append(' '.join(clean_data(raw_data['genres'])))
    return elem

@app.get("/recommendations")
def recommendations():
    movie_id = request.args.get('movieid', default=None)

    if(movie_id is None): 
        return 'Invalid request', 400

    res = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key={environ['MVDB_KEY']}")
    jsonres = json.loads(res.text)
    soup = []
    full_data = []
    #Add requested movie to soup
    jsonres['results'].insert(0, {'id': movie_id, 'title': 'Any'})

    #Add recommended movies to soup
    for movie in jsonres['results']:
        temp, raw_data = get_movie_object(movie['id'])
        full_data.append(temp)
        soup.append(' '.join(get_soup(raw_data)))

    # print(soup)

    count = CountVectorizer(stop_words='english')
    count_matrix = count.fit_transform(soup)
    # Compute the Cosine Similarity matrix based on the count_matrix

    cosine_sim2 = cosine_similarity(count_matrix, count_matrix)
    ids = [jsonres['results'][i]['id'] for i in get_recommendations(cosine_sim2)]
    response = []
    for id in ids:
        response.append(next(item for item in full_data if item["id"] == id))
    
    return jsonify(response)

def get_recommendations(cosine_sim):
    # Get the index of the movie that matches the title
    idx = 0

    # Get the pairwise similarity scores of all movies with that movie
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # Get the scores of the 5 most similar movies
    sim_scores = sim_scores[1:6]
    print(sim_scores)

    # Get the movie indices
    movie_indices = [i[0] for i in sim_scores]

    # Return the top 10 most similar movies
    return movie_indices

