import app
import flask
import json

@app.app.route('/')
def main():
    return flask.render_template('index.html')


@app.app.route('/grid/load', methods=['POST'])
def get_grid():
    grid = [[None for _ in range(10)] for _ in range(10)]
    with app.get_conn() as conn:
        cursor = conn.cursor()
        cursor.execute('select * from place.grid')
        for row in cursor.fetchall():
            grid[row[2]][row[3]] = {
                'username': row[0],
                'color': row[4],
            }
    return flask.jsonify(grid)


@app.app.route('/grid/save', methods=['POST'])
def save_pixel():
    obj = flask.request.get_json()
    obj['ip_address'] = flask.request.remote_addr
    with app.get_conn() as conn:
        cursor = conn.cursor()
        cursor.execute('insert into place.history (username, ip_address, row, col, color) values (%(username)s, %(ip_address)s, %(row)s, %(col)s, %(color)s)', obj)
        cursor.execute('''
            insert into place.grid (username, ip_address, row, col, color) values 
            (%(username)s, %(ip_address)s, %(row)s, %(col)s, %(color)s)
            on conflict (row, col) do update
            set username = %(username)s,
                ip_address = %(ip_address)s,
                color = %(color)s
        ''', obj)
        conn.commit()
    return ''