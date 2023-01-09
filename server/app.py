#Test
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from os import environ
import json
import requests
from flask_cors import CORS

# Initialize .env variabiles in process
load_dotenv('./.env')

# Initialize Flask App
app = Flask(__name__)
CORS(app)


def get_movie_object(movieid: int) -> dict:
    """Function for obtaining movie details from it's ID

    Args:
        movieid (int): ID of the Movie

    Returns:
        dict: Movie details Object
    """  

    initial = {}
    # Get movie details from api endpoint
    res = requests.get(f"https://api.themoviedb.org/3/movie/{movieid}?api_key={environ['MVDB_KEY']}&append_to_response=watch%2Fproviders%2Ccredits%2Calternative_titles%2Cimages%2Ckeywords")
    jsonres = json.loads(res.text)
    
    # Construct movie object for soup analysis
    get_movie_details(jsonres, initial)
    get_movie_keywords(jsonres['keywords'], initial)
    get_movie_cast(jsonres['credits'], initial)
    
    # Return both movie object and full details
    return jsonres, initial

def get_movie_cast(data, initial):
    """Function for building movie cast dictionary

    Args:
        data: Full Movie details
        initial: dictionary to update
    """ 
    initial['cast'] = [i['name'] for i in data['cast']]
    initial['cast'] += [i['name'] for i in data['crew']]

def get_movie_keywords(data, initial):
    """Function for building movie keywords dictionary

    Args:
        data: Full Movie details
        initial: dictionary to update
    """
    initial['keywords'] = [i['name'] for i in data['keywords']]

def get_movie_details(data, initial):
    """Function for building movie details dictionary

    Args:
        data: Full Movie details
        initial: dictionary to update
    """
    initial['desc'] = data['overview']
    initial['title'] = data['title']
    initial['genres'] = [i['name'] for i in data['genres']]


def clean_data(x):
    """Function for cleaning data, by removing spaces and making text lowercase

    Args:
        x (list[str] | str): String or list of string to clean

    Returns:
        list[str] | str: cleaned string
    """
    if isinstance(x, list):
        return [str.lower(i.replace(" ", "")) for i in x]
    else:
        #Check if director exists. If not, return empty string
        if isinstance(x, str):
            return str.lower(x.replace(" ", ""))
        else:
            return ''


def get_soup(raw_data):
    """Function for constructing movie soup

    Args:
        raw_data (dict): dictionary of movie details

    Returns:
        str: complete movie soup
    """
    elem = []
    elem.append(' '.join(clean_data(raw_data['keywords'])))
    elem.append(' '.join(clean_data(raw_data['cast'])))
    elem.append(' '.join(clean_data(raw_data['genres'])))
    return elem

# Endpoint for handling recommendations, using GET http verb
@app.get("/recommendations")
def recommendations():
    """Function for gathering and building new recommendations from the given one"""

    # Check if the movie ID is present in the request arguments
    movie_id = request.args.get('movieid', default=None)

    # Return 400 if it's not
    if(movie_id is None): 
        return 'Invalid request', 400

    # Get details of initial movie
    res = requests.get(f"https://api.themoviedb.org/3/movie/{movie_id}/recommendations?api_key={environ['MVDB_KEY']}")
    jsonres = json.loads(res.text)
    soup = []
    full_data = []

    # Add requested movie to soup
    jsonres['results'].insert(0, {'id': movie_id, 'title': 'Any'})

    #Add all recommended movies to soup
    for movie in jsonres['results']:
        temp, raw_data = get_movie_object(movie['id'])
        full_data.append(temp)
        soup.append(' '.join(get_soup(raw_data)))

    # Convert movie soups to a matrix of token counts.
    count = CountVectorizer(stop_words='english')
    
    # Compute the Cosine Similarity matrix based on the count_matrix
    count_matrix = count.fit_transform(soup)

    # Compute cosine similarity between every movie with each other.
    cosine_sim2 = cosine_similarity(count_matrix, count_matrix)

    # Get movie ID's of the recommendations
    ids = [jsonres['results'][i]['id'] for i in get_recommendations(cosine_sim2)]
    response = []

    for id in ids:
        # Add the details of every recommended movie to the response array
        response.append(next(item for item in full_data if item["id"] == id))
    
    # Return JSON rapresentation of final response array
    return jsonify(response)

def get_recommendations(cosine_sim):    
    """Function for getting recommendations from the cosine similarity matrix

    Args:
        cosine_sim (list[list]): cosine similarity matrix

    Returns:
        list[number]: the first 5 recommended movie IDs
    """


    # Get the index of the movie that matches the title
    idx = 0

    # Get the pairwise similarity scores of all movies with that movie
    sim_scores = list(enumerate(cosine_sim[idx]))

    # Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 5 most similar movies, ignoring the first one since it's always
    # going to be itself
    sim_scores = sim_scores[1:6]
    print(sim_scores)

    # Get the movie indices
    movie_indices = [i[0] for i in sim_scores]

    # Return the top 5 most similar movies indices
    return movie_indices

