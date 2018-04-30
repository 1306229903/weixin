from datetime import datetime
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from markdown import markdown
import bleach
from flask import current_app, request, url_for
from flask_login import UserMixin, AnonymousUserMixin
from app.exceptions import ValidationError
from . import db, login_manager
from sqlalchemy.types import Boolean


class Indicator(db.Model):
    __tablename__ = 'health_indicator'
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('user.id'))
    weight=db.Column(db.Float)
    temp=db.Column(db.Float)
    heart=db.Column(db.Integer)
    breath=db.Column(db.Integer)
    diet=db.Column(db.Integer)
    exblood=db.Column(db.Integer)
    conblood=db.Column(db.Integer)
    sleep=db.Column(db.Integer)
    statu=db.Column(db.String(128))


    def __repr__(self):
        return '<indicator %r>' % self.weight

    
class Record(db.Model):
    __tablename__ = 'health_record'
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.Integer, db.ForeignKey('user.id'))
    height=db.Column(db.Integer)
    weight=db.Column(db.Integer)
    marriage=db.Column(db.Boolean)
    smoke=db.Column(db.Boolean)
    wine=db.Column(db.Boolean)
    diet=db.Column(db.Boolean)
    sleep=db.Column(db.Boolean)
    sex=db.Column(db.Boolean)
    bowel=db.Column(db.Boolean)
    allergy=db.Column(db.Boolean)
    realname=db.Column(db.String(64))
    medical_his=db.Column(db.TEXT())
    birthday=db.Column(db.DateTime)



    def __repr__(self):
        return '<Record %r>' % self.realname

class wxUser(UserMixin, db.Model):
    __tablename__ = 'wxuser'
    id = db.Column(db.Integer, primary_key=True)
    wxusername = db.Column(db.String(64), unique=True, index=True)
    wxprofile=db.Column(db.TEXT())
    tel_number=db.Column(db.Integer)
    money=db.Column(db.Integer)
    moneyused=db.Column(db.Integer)
    cash=db.Column(db.Float)
    step=db.Column(db.Integer)
    signtime=db.Column(db.DateTime)



    def __repr__(self):
        return '<wxUser %r>' % self.wxusername


class User(UserMixin, db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password=db.Column(db.String(128))
    profile_photo=db.Column(db.TEXT())
    tel_number=db.Column(db.Integer)
    money=db.Column(db.Integer)
    moneyused=db.Column(db.Integer)
    cash=db.Column(db.Float)
    step=db.Column(db.Integer)
    signtime=db.Column(db.DateTime)



    def __repr__(self):
        return '<User %r>' % self.username



class Article(db.Model):
    __tablename__='article'
    id=db.Column(db.Integer,primary_key=True)
    categoryid = db.Column(db.Integer, db.ForeignKey('category.id'),nullable=True)
    userid=db.Column(db.Integer)
    author=db.Column(db.String(120))
    addtime=db.Column(db.DateTime)
    img=db.Column(db.Text)
    content=db.Column(db.Text)
    title=db.Column(db.Text)
    likes=db.Column(db.Integer,default=0)
    comments=db.Column(db.Text)
    

    def __repr__(self):
        return '<article %r>' % self.name 

class Category(db.Model):
    __tablename__='category'
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(64))

    def __repr__(self):
        return '<catergory %r>' % self.name 

