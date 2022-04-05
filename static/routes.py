from app import app
import flask


@app.route('/')
def main():
    return flask.render_template('index.html')