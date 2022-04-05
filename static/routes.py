import app
import flask
import json
import datetime
with app.get_conn() as conn:
    cursor = conn.cursor()
    cursor.execute('select max(insert_dt) from place.history')
    last_updated = cursor.fetchone()[0].replace(microsecond=0)


@app.app.route('/')
def main():
    return flask.render_template('index.html')


@app.app.route('/grid/needs_update', methods=['POST'])
def get_needs_update():
    obj = flask.request.get_json()['lastServerUpdate']
    if obj is None:
        return 'true'
    if last_updated is None:
        return 'false'
    else:
        return str(datetime.datetime.strptime(obj, '%Y-%m-%d %H:%M:%S') < last_updated).lower()


@app.app.route('/grid/load', methods=['POST'])
def get_grid():
    grid = [[None for _ in range(100)] for _ in range(100)]
    with app.get_conn() as conn:
        cursor = conn.cursor()
        cursor.execute('select * from place.grid')
        for row in cursor.fetchall():
            grid[row[2]][row[3]] = {
                'username': row[0],
                'color': row[4],
            }
    return flask.jsonify({
        'pixels': grid,
        'lastServerUpdate': last_updated.strftime("%Y-%m-%d %H:%M:%S") if last_updated is not None else None,
    })


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
    global last_updated
    last_updated = datetime.datetime.now().replace(microsecond=0)  # relies on the fact that this and the Postgres DB are in the same timezone
    return ''