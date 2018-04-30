# uncompyle6 version 2.9.6
# Python bytecode 2.7 (62211)
# Decompiled from: Python 2.7.12 (v2.7.12:d33e0cf91556, Jun 27 2016, 15:24:40) [MSC v.1500 64 bit (AMD64)]
# Embedded file name: models.py
# Compiled at: 2016-12-02 21:27:57
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

class Permission:
    FOLLOW = 1
    COMMENT = 2
    WRITE_ARTICLES = 4
    MODERATE_COMMENTS = 8
    ADMINISTER = 128


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    default = db.Column(db.Boolean, default=False, index=True)
    permissions = db.Column(db.Integer)
    users = db.relationship('User', backref='role', lazy='dynamic')

    @staticmethod
    def insert_roles():
        roles = {'User': (
                  Permission.FOLLOW | Permission.COMMENT | Permission.WRITE_ARTICLES, True),
           'Moderator': (Permission.FOLLOW | Permission.COMMENT | Permission.WRITE_ARTICLES | Permission.MODERATE_COMMENTS, False),'Administrator': (255, False)}
        for r in roles:
            role = Role.query.filter_by(name=r).first()
            if role is None:
                role = Role(name=r)
            role.permissions = roles[r][0]
            role.default = roles[r][1]
            db.session.add(role)

        db.session.commit()
        return

    def __repr__(self):
        return '<Role %r>' % self.name


class Follow(db.Model):
    __tablename__ = 'follows'
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    followed_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128))
    confirmed = db.Column(db.Boolean, default=False)
    name = db.Column(db.String(64))
    location = db.Column(db.String(64))
    about_me = db.Column(db.Text())
    member_since = db.Column(db.DateTime(), default=datetime.utcnow)
    last_seen = db.Column(db.DateTime(), default=datetime.utcnow)
    avatar_hash = db.Column(db.String(32))
    posts = db.relationship('Post', backref='author', lazy='dynamic')
    followed = db.relationship('Follow', foreign_keys=[Follow.follower_id], backref=db.backref('follower', lazy='joined'), lazy='dynamic', cascade='all, delete-orphan')
    followers = db.relationship('Follow', foreign_keys=[Follow.followed_id], backref=db.backref('followed', lazy='joined'), lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='author', lazy='dynamic')

    @staticmethod
    def generate_fake(count=100):
        from sqlalchemy.exc import IntegrityError
        from random import seed
        import forgery_py
        seed()
        for i in range(count):
            u = User(email=forgery_py.internet.email_address(), username=forgery_py.internet.user_name(True), password=forgery_py.lorem_ipsum.word(), confirmed=True, name=forgery_py.name.full_name(), location=forgery_py.address.city(), about_me=forgery_py.lorem_ipsum.sentence(), member_since=forgery_py.date.date(True))
            db.session.add(u)
            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()

    @staticmethod
    def add_self_follows():
        for user in User.query.all():
            if not user.is_following(user):
                user.follow(user)
                db.session.add(user)
                db.session.commit()

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.role is None:
            if self.email == current_app.config['FLASKY_ADMIN']:
                self.role = Role.query.filter_by(permissions=255).first()
            if self.role is None:
                self.role = Role.query.filter_by(default=True).first()
        if self.email is not None and self.avatar_hash is None:
            self.avatar_hash = hashlib.md5(self.email.encode('utf-8')).hexdigest()
        self.followed.append(Follow(followed=self))
        return

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_confirmation_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'confirm': self.id})

    def confirm(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False

        if data.get('confirm') != self.id:
            return False
        self.confirmed = True
        db.session.add(self)
        return True

    def generate_reset_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'reset': self.id})

    def reset_password(self, token, new_password):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False

        if data.get('reset') != self.id:
            return False
        self.password = new_password
        db.session.add(self)
        return True

    def generate_email_change_token(self, new_email, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'change_email': self.id,'new_email': new_email})

    def change_email(self, token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False

        if data.get('change_email') != self.id:
            return False
        else:
            new_email = data.get('new_email')
            if new_email is None:
                return False
            if self.query.filter_by(email=new_email).first() is not None:
                return False
            self.email = new_email
            self.avatar_hash = hashlib.md5(self.email.encode('utf-8')).hexdigest()
            db.session.add(self)
            return True

    def can(self, permissions):
        return self.role is not None and self.role.permissions & permissions == permissions

    def is_administrator(self):
        return self.can(Permission.ADMINISTER)

    def ping(self):
        self.last_seen = datetime.utcnow()
        db.session.add(self)

    def gravatar(self, size=100, default='identicon', rating='g'):
        if request.is_secure:
            url = 'https://secure.gravatar.com/avatar'
        else:
            url = 'http://www.gravatar.com/avatar'
        hash = self.avatar_hash or hashlib.md5(self.email.encode('utf-8')).hexdigest()
        return '{url}/{hash}?s={size}&d={default}&r={rating}'.format(url=url, hash=hash, size=size, default=default, rating=rating)

    def follow(self, user):
        if not self.is_following(user):
            f = Follow(follower=self, followed=user)
            db.session.add(f)

    def unfollow(self, user):
        f = self.followed.filter_by(followed_id=user.id).first()
        if f:
            db.session.delete(f)

    def is_following(self, user):
        return self.followed.filter_by(followed_id=user.id).first() is not None

    def is_followed_by(self, user):
        return self.followers.filter_by(follower_id=user.id).first() is not None

    @property
    def followed_posts(self):
        return Post.query.join(Follow, Follow.followed_id == Post.author_id).filter(Follow.follower_id == self.id)

    def to_json(self):
        json_user = {'url': url_for('api.get_user', id=self.id, _external=True),'username': self.username,'member_since': self.member_since,'last_seen': self.last_seen,'posts': url_for('api.get_user_posts', id=self.id, _external=True),'followed_posts': url_for('api.get_user_followed_posts', id=self.id, _external=True),'post_count': self.posts.count()}
        return json_user

    def generate_auth_token(self, expiration):
        s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id}).decode('ascii')

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None

        return User.query.get(data['id'])

    def __repr__(self):
        return '<User %r>' % self.username


class AnonymousUser(AnonymousUserMixin):

    def can(self, permissions):
        return False

    def is_administrator(self):
        return False


login_manager.anonymous_user = AnonymousUser

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    @staticmethod
    def generate_fake(count=100):
        from random import seed, randint
        import forgery_py
        seed()
        user_count = User.query.count()
        for i in range(count):
            u = User.query.offset(randint(0, user_count - 1)).first()
            p = Post(body=forgery_py.lorem_ipsum.sentences(randint(1, 5)), timestamp=forgery_py.date.date(True), author=u)
            db.session.add(p)
            db.session.commit()

    @staticmethod
    def on_changed_body(target, value, oldvalue, initiator):
        allowed_tags = [
         'a', 'abbr', 'acronym', 'b', 'blockquote', 'code', 'em', 'i', 'li', 'ol', 'pre', 'strong', 'ul', 'h1', 'h2', 'h3', 'p']
        target.body_html = bleach.linkify(bleach.clean(markdown(value, output_format='html'), tags=allowed_tags, strip=True))

    def to_json(self):
        json_post = {'url': url_for('api.get_post', id=self.id, _external=True),'body': self.body,'body_html': self.body_html,'timestamp': self.timestamp,'author': url_for('api.get_user', id=self.author_id, _external=True),'comments': url_for('api.get_post_comments', id=self.id, _external=True),'comment_count': self.comments.count()}
        return json_post

    @staticmethod
    def from_json(json_post):
        body = json_post.get('body')
        if body is None or body == '':
            raise ValidationError('post does not have a body')
        return Post(body=body)


db.event.listen(Post.body, 'set', Post.on_changed_body)

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text)
    body_html = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    disabled = db.Column(db.Boolean)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    news_id = db.Column(db.Integer, db.ForeignKey('conference.id'))

    @staticmethod
    def on_changed_body(target, value, oldvalue, initiator):
        allowed_tags = [
         'a', 'abbr', 'acronym', 'b', 'code', 'em', 'i', 'strong']
        target.body_html = bleach.linkify(bleach.clean(markdown(value, output_format='html'), tags=allowed_tags, strip=True))

    def to_json(self):
        json_comment = {'url': url_for('api.get_comment', id=self.id, _external=True),'post': url_for('api.get_post', id=self.post_id, _external=True),'body': self.body,'body_html': self.body_html,'timestamp': self.timestamp,'author': url_for('api.get_user', id=self.author_id, _external=True)}
        return json_comment

    @staticmethod
    def from_json(json_comment):
        body = json_comment.get('body')
        if body is None or body == '':
            raise ValidationError('comment does not have a body')
        return Comment(body=body)


db.event.listen(Comment.body, 'set', Comment.on_changed_body)

class Types(db.Model):
    __tablename__ = 'types'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)

    @staticmethod
    def insert_types():
        types = {
         u'\u8981\u95fb', u'\u519b\u4e8b', u'\u793e\u4f1a', u'\u653f\u6cbb', u'\u4f53\u80b2', u'\u8d22\u7ecf', u'\u5a31\u4e50', u'\u79d1\u6280'}
        for t in types:
            type = Types.query.filter_by(name=t).first()
            if type is None:
                type = Types(name=t)
            type.name = t
            db.session.add(type)

        db.session.commit()
        return

    def __repr__(self):
        return '<Types %r>' % self.name


class Conference(db.Model):
    __tablename__ = 'conference'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64))
    author = db.Column(db.String(64))
    type_id = db.Column(db.Integer)
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    type_id = db.Column(db.Integer, db.ForeignKey('types.id'))
    files = db.Column(db.Text)


class Ads(db.Model):
    __tablename__ = 'ads'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64))
    author = db.Column(db.String(64))
    type_id = db.Column(db.Integer)
    content = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    type_id = db.Column(db.Integer, db.ForeignKey('types.id'))
    files = db.Column(db.Text)
    link = db.Column(db.Text)


class Userlogs(db.Model):
    __tablename__ = 'userlogs'
    id = db.Column(db.Integer, primary_key=True)
    news_id = db.Column(db.Integer, db.ForeignKey('conference.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    uuid = db.Column(db.String(40))
    useractions = db.Column(db.String(10))
    useremail = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    search_review = db.Column(db.Text)


class AlgoTypes(db.Model):
    __tablename__ = 'algotypes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)

    @staticmethod
    def insert_algotypes():
        algotypes = {
         u'\u534f\u8c03\u7b97\u6cd5', u'svd\u7b97\u6cd5', u'\u8fd1\u90bb\u7b97\u6cd5', u'\u9690\u8bed\u4e49\u7b97\u6cd5'}
        for t in algotypes:
            type = AlgoTypes.query.filter_by(name=t).first()
            if type is None:
                type = AlgoTypes(name=t)
            type.name = t
            db.session.add(type)

        db.session.commit()
        return

    def __repr__(self):
        return '<algotypes %r>' % self.name
# okay decompiling models.pyc
