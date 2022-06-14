from app import app, db
from app.models import User
from flask import render_template, request

@app.route('/', methods=['GET','POST'])
def home():
    if request.method == 'POST':
        user = User()
        user.username = request.form['username']
        db.session.add(user)
        db.session.commit()
    return render_template('home.html')

@app.route('/users', methods=['GET'])
def users():
    users = User.query.all()
    return render_template('all_users.html', users=users)
