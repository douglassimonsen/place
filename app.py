import flask
import psycopg2
import json
import os; os.chdir(os.path.dirname(os.path.abspath(__file__)))
app = flask.Flask(__name__)
dsn = json.load(open('dsn.json'))


def get_conn():
    return psycopg2.connect(**dsn)
