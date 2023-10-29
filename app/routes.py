from app import app
from flask import render_template, send_from_directory

@app.route('/', methods=['GET','POST'])
def home():
    return render_template('home.html')

@app.route('/users', methods=['GET'])
def users():
    return render_template('all_users.html')

@app.route('/graphics/<path:filename>')
def serve_image(filename):
    return send_from_directory('static/graphics', filename)


