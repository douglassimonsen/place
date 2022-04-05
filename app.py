import flask
import psycopg2
import json

app = flask.Flask(__name__)
dsn = json.load(open('dsn.json'))


def get_conn():
    return psycopg2.connect(**dsn)
