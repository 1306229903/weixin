import os
import re
import json
import hashlib
import datetime,time
import uuid
import string
from flask import render_template, redirect, url_for, abort, flash, request,\
    current_app, make_response, app
from flask_login import login_required, current_user
from flask_sqlalchemy import get_debug_queries
from . import main

from .. import db
from ..models import Article, Category, User,Record,wxUser,Indicator


from flask_login import *
from sqlite3 import IntegrityError
from config import Config
from send_SMS import query_send_detail, send_sms
root_dir = os.getcwd()
# For a given file, return whether it's an allowed type or not

host_url = 'http://127.0.0.1:5000/'

phonenumber=0


# 微信index界面主内容加载

@main.route('/returnPost', methods=['GET', 'POST'])
def returnPost():
    data=request.json
    types=data['currentTab']+1
    ll = []
    aa=[]

    if types!=0:
        temps = Article.query.filter_by(categoryid=types).all()
    
        for temp in temps:    
            cat = Category.query.filter_by(id=temp.categoryid).first()
            aa=temp.comments.split('#970626q|')
            ll.append({'title': temp.title,'type':cat.name,'img': host_url + 'static/img/' + temp.img, 'time': temp.addtime.strftime(
                '%Y-%m-%d'), 'likes': temp.likes, 'comments': len(aa)/4, 'id': temp.id,'disgui':1})
               
    else:
        temps = Article.query.all()
        for temp in temps:
            cat = Category.query.filter_by(id=temp.categoryid).first()
            aa=temp.comments.split('#970626q|')
            ll.append({'title': temp.title,'type':cat.name,'img': host_url + 'static/img/' + temp.img, 'time': temp.addtime.strftime(
                '%Y-%m-%d'), 'likes': temp.likes, 'comments': len(aa)/4, 'id': temp.id,'disgui':0})   

    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json


#滑动条内容
@main.route('/returnPosts', methods=['GET', 'POST'])
def returnPosts():
    temps = Article.query.order_by("addtime").limit(3)
    ll = []
    for temp in temps:
        ll.append({'id':temp.id,'title': temp.title, 'img': host_url + 'static/img/' + temp.img, 'time': temp.addtime.strftime(
            '%Y-%m-%d'), 'likes': temp.likes})
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

#搜索
@main.route('/returnSerach', methods=['GET', 'POST'])
def returnSerach():

    data=request.json
    condition=data['condition']
    temps=Article.query.filter("title like '%"+ condition + "%' or content like '%"+ condition +"%'").all()
    ll = []
    aa=[]

    for temp in temps:
        cat = Category.query.filter_by(id=temp.categoryid).first()
        aa=temp.comments.split('#970626q|')
        ll.append({'id':temp.id,'title': temp.title, 'img': host_url + 'static/img/' + temp.img, 'time': temp.addtime.strftime(
            '%Y-%m-%d'), 'likes': temp.likes,'type':cat.name,'comments': len(aa)/4})
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json



#文章详情
@main.route('/returnPostDetail', methods=['GET', 'POST'])
def returnPostDetail():
    data=request.json
    aa=[]
    ll = []
    id=data['id']
    temps = Article.query.filter_by(id=id).first()
    cat = Category.query.filter_by(id=temps.categoryid).first()
    aa=temps.comments.split('#970626q|')
    ll.append({'id':temps.id,'title': temps.title,'content':temps.content,'img': host_url + 'static/img/' + temps.img, 'time': temps.addtime.strftime(
            '%Y-%m-%d'), 'likes': temps.likes, 'comments': len(aa)/4,'author':temps.author,'types':cat.name })
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

#点赞
@main.route('/dianzan', methods=['GET', 'POST'])
def dianzan():

    data=request.json
    aa=[]
    ll = []
    id=data['id']

    temps = Article.query.filter_by(id=id).first()
    temps.likes=int(temps.likes)+1

    db.session.add(temps)
    db.session.commit
    
    ll.append({'likes':temps.likes})
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

#评论添加
@main.route('/comment', methods=['GET', 'POST'])
def comment():

    data = request.json
    phone=data['phone']
    content=data['content']
    id=data['id']

    ll = []
    aa=[]
    temp=[]

    users = User.query.filter_by(tel_number=phone).first() 
    articles = Article.query.filter_by(id=id).first()
    time=datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    profile_photo=host_url + 'static/img/userimg/'+users.profile_photo
    
    temp=str(time)+'#970626q|'+profile_photo+'#970626q|'+content+'#970626q|'+users.username

    if articles.comments is None or articles.comments=='':
        articles.comments=temp
        db.session.add(articles)
        db.session.commit
    else:
        articles.comments=articles.comments+'#970626q|'+temp
        db.session.add(articles)
        db.session.commit

    aa=articles.comments.split('#970626q|')
    print len(aa)

    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

#评论展示
@main.route('/commentshow', methods=['GET', 'POST'])
def commentshow():

    data = request.json
    id=data['id']
    ll = [] 
    aa=[]
    

    articles = Article.query.filter_by(id=id).first()
    
    aa=articles.comments.split('#970626q|')
    length=len(aa)/4
 
    person_index=1
    for person in range(0,length):
        index=person_index*4
        ll.append({
            'time':aa[index-4],'photo':aa[index-3],'content':aa[index-2],'username':aa[index-1]
        })
        person_index=person_index+1       
    

    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

#手机验证码

@main.route('/test', methods=['GET', 'POST'])
def test():

    data = request.json

    ll = []
    phone = data['phone']
    __name__ = 'send'
    if __name__ == 'send':
        __business_id = uuid.uuid1()
        print __business_id
        params = "{\"code\":\"9706\",\"product\":\"康动我心\"}"
        print send_sms(__business_id, phone, "康动我心", "SMS_105175028", params)
        ll.append({'code': 9706})

    if __name__ == 'query':
        print query_send_detail("1234567^8901234", phone, 10, 1, "20171018")
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json


# 微信注册
@main.route('/register', methods=['GET', 'POST'])
def register():

    data = request.json

    ll = []
    phone = data['phone']
    password = data['password']
    confirmcode = data['confirmcode']

    userr = User.query.filter_by(tel_number=phone).first()

    if userr is None:
        ll.append({'zhu': 1})
        if confirmcode == "9706":
            ll.append({'info': 1})
            id=1
            if isnotemptyuser():
               id=int(getmaxiduser())+1
            users = User(id=id,tel_number=phone, password=password,money=0,moneyused=0,cash=0)
            db.session.add(users)
            db.session.commit
        else:
            ll.append({'info': 0})
    else:
        ll.append({'zhu': 0})
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json


# 微信登录
@main.route('/login', methods=['GET', 'POST'])
def login():

    data = request.json

    ll = []
    phone = data['phone']
    password = data['password']

    users = User.query.filter_by(tel_number=phone).first()
    username=users.username
    if users is not None and users.password == password:
        ll.append({'info': 1})
    else:
        ll.append({'info': 0})
    if username is None or username=='':
        ll.append({'isusername': 1})
    else:
        ll.append({'isusername': 0})  
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

# 存储用户名
@main.route('/name', methods=['GET', 'POST'])
def name():

    data = request.json

    ll = []
    phone = data['phone']
    username = data['username']
    users = User.query.filter_by(tel_number=phone).first()
    if users is not None:
        users.username=username
        db.session.add(users)
        db.session.commit

    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

# 查询用户名

@main.route('/namefind', methods=['GET', 'POST'])
def namefind():

    data = request.json

    ll = []
    phone = data['phone']
    global phonenumber
    phonenumber=phone
    users = User.query.filter_by(tel_number=phone).first()
    wxusers=wxUser.query.filter_by(tel_number=phone).first()
    if wxusers is not None:

       username=wxusers.wxusername
       money=wxusers.money
       ll.append({'username':username})
       ll.append({'money':money})
       if wxusers.wxprofile is  not None:
                ll.append({'img': wxusers.wxprofile})
       else:
                ll.append({'img': host_url + 'static/img/userimg/1.ico'})

    else:
        if users is  not None:
            username=users.username
            money=users.money
            ll.append({'username':username})
            ll.append({'money':money})
            if users.profile_photo is  not None:
                ll.append({'img': host_url + 'static/img/userimg/'+users.profile_photo})
            else:
                ll.append({'img': host_url + 'static/img/userimg/1.ico'})
        else:
            ll.append({'username':''})
            ll.append({'money':0})
            ll.append({'img': host_url + 'static/img/userimg/1.ico'})        
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

# 存储个人头像
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ['png', 'jpg', 'jpeg', 'gif','JPG']

@main.route('/profile', methods=['GET', 'POST'])
def profile():
    
    ll = []
    uploaded_files = request.files.getlist("file")
    
    for file in uploaded_files:
         
            
         if file and allowed_file(file.filename):
               
            filename = file.filename
           
            file.save(os.path.join(root_dir, 'app/static/img/userimg/', filename)) 
            users = User.query.filter_by(tel_number=phonenumber).first()
            users.profile_photo=filename
            db.session.add(users)
            db.session.commit

            ll.append({'info':filename})
    
    
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

# 每日签到
@main.route('/sign', methods=['GET', 'POST'])
def sign():
    ll = []
    data = request.json
    signtime=datetime.datetime.now()
    
    phone = data['phone']
    users = User.query.filter_by(tel_number=phone).first()
    if users is not None:
        money=users.money
        A=datetime.datetime.now().strftime('%Y-%m-%d')
        if users.signtime is  not None:
            B=users.signtime.strftime('%Y-%m-%d')
            if A!=B:
                users.signtime=signtime
                users.money=money+100
                db.session.add(users)
                db.session.commit
                ll.append({'info':1})
                users = User.query.filter_by(tel_number=phone).first()
                ll.append({'money':users.money})
            else:
                
                ll.append({'info':0}) 
                users = User.query.filter_by(tel_number=phone).first()
                ll.append({'money':users.money})
            
            
        else:
            users.signtime=signtime
            users.money=money+100
            db.session.add(users)
            db.session.commit 
            ll.append({'info':1})
            users = User.query.filter_by(tel_number=phone).first()
            ll.append({'money':users.money})
    else:
        print  "暂未登录"
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

# 微信提现
@main.route('/deposit', methods=['GET', 'POST'])
def deposit():

    data=request.json
    phone = data['phone']
    moneyusing=data['moneyusing']
    ll = []
    users = User.query.filter_by(tel_number=phone).first()
    moneyused=users.moneyused
    cash=users.cash
    money=0
    
    if users.money>=2000:
        
        money=users.money-moneyusing
        
        if money>=0:
           users.money=money
           users.moneyused=moneyused+moneyusing
           users.cash=cash+moneyusing/100*0.01
           db.session.add(users)
           db.session.commit
           ll.append({'informa':1})
           ll.append({'moneyused':users.moneyused,'cash':users.cash,'money':users.money})
           
        else:
           ll.append({'informa':0}) 
           ll.append({'moneyused':users.moneyused,'cash':users.cash,'money':users.money})
    else:
        ll.append({'informa':0})
        ll.append({'moneyused':users.moneyused,'cash':users.cash,'money':users.money})
        

    
   
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

# 健康档案录入1
@main.route('/recordfr', methods=['GET', 'POST'])
def recordfr():
    
    ll = []
    data=request.json
    phone = data['phone']

    height=data['list']['listf'][0]['value']
    weight=data['list']['listf'][1]['value']
    marriage=data['list']['listf'][2]['value']
    allergy=data['list']['listf'][3]['value']

    smoke=data['list']['lists'][0]['value']
    wine=data['list']['lists'][1]['value']
    diet=data['list']['lists'][2]['value']
    sleep=data['list']['lists'][3]['value']
    bowel=data['list']['lists'][4]['value']
    medical_his=data['list']['listt'][0]
    
    users = User.query.filter_by(tel_number=phone).first()
    
    records= Record.query.filter_by(userid=users.id).first()

    if records is None:
       id=1
       if isnotempty():
           id=int(getmaxid())+1
       marriage=True  if marriage=='已婚' else  False
       allergy=True  if allergy=='是' else  False
       smoke=True  if smoke=='是' else  False
       wine=True  if wine=='是' else  False
       diet=True  if diet=='是' else  False
       sleep=True  if sleep=='是' else  False
       bowel=True  if bowel=='是' else  False
       recordss=Record(id=id,userid=users.id,height=height,weight=weight,marriage=marriage,allergy=allergy,
       smoke=smoke,wine=wine,diet=diet,sleep=sleep,bowel=bowel,medical_his=medical_his )
       db.session.add(recordss)
       db.session.commit

    else:
       records.marriage=True  if marriage=='已婚' else  False
       records.allergy=True  if allergy=='是' else  False
       records.smoke=True  if smoke=='是' else  False
       records.wine=True  if wine=='是' else  False
       records.diet=True  if diet=='是' else  False
       records.sleep=True  if sleep=='是' else  False
       records.bowel=True  if bowel=='是' else  False
       records.height=height
       records.weight=weight
       records.medical_his=medical_his
       db.session.add(records)
       db.session.commit
     
    
    
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json


# 健康档案查询1
@main.route('/recordfrcha', methods=['GET', 'POST'])
def recordfrcha():
    

    ll = []
    data=request.json
    phone = data['phone']
    users = User.query.filter_by(tel_number=phone).first()
    records= Record.query.filter_by(userid=users.id).first()
    
    if records is None:
       age=0  
       ll.append({'weight':0,'height':0,'marriage':'未婚','allergy':'是','smoke':'是','wine':'否','diet':'否',
       'sleep':'是','bowel':'否','username':'暂未设置','age':age,'sex':'男','medical_his':'暂无任何记录'})
    else:
       marriage='已婚' if records.marriage else '未婚'
       allergy='是' if records.allergy else '否'
       smoke='是' if records.smoke else '否'
       wine='是' if records.wine else '否'
       diet='是' if records.diet else '否'
       sleep='是' if records.sleep else '否'
       bowel='是' if records.bowel else '否'
       sex='男' if records.sex else '女'
       age=int(datetime.datetime.now().strftime('%Y'))-int(records.birthday.strftime('%Y'))
       ll.append({'weight':records.weight,'height':records.height,'marriage':marriage,'allergy':allergy,
       'smoke':smoke,'wine':wine,'diet':diet,'sleep':sleep,'bowel':bowel,'username':records.realname,
       'age':age,'sex':sex,'medical_his':records.medical_his}) 
    
    
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

# 健康档案录入2
@main.route('/record', methods=['GET', 'POST'])
def record():
    

    ll = []
    data=request.json
    phone = data['phone'] 
    realname=data['realname']
    sex=data['sex'] 
    date=data['date']
    users = User.query.filter_by(tel_number=phone).first()
    
    records= Record.query.filter_by(userid=users.id).first()
 
    if records is None:
       id=1
       if isnotempty():
           id=int(getmaxid())+1
       sex=True if int(sex) else False
       temp=time.strptime(date,'%Y-%m-%d')
       y,m,d=temp[0:3]
       birthday=datetime.datetime(y,m,d)    
       recordss=Record(id=id,userid=users.id,realname=realname,sex=sex,birthday=birthday)
       db.session.add(recordss)
       db.session.commit

    else:
        records.realname=realname
        records.sex=True if int(sex) else False
        temp=time.strptime(date,'%Y-%m-%d')
        y,m,d=temp[0:3]
        records.birthday=datetime.datetime(y,m,d)
        db.session.add(records)
        db.session.commit
     
    
    
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

# 健康档案查询2
@main.route('/recordcha', methods=['GET', 'POST'])
def recordcha():
    

    ll = []
    data=request.json
    phone = data['phone']
    users = User.query.filter_by(tel_number=phone).first()
    records= Record.query.filter_by(userid=users.id).first()
    
    if records is None:
       ll.append({'sex':True,'realname':'','date':'2000-01-01'})
    else:
       ll.append({'sex':records.sex,'realname':records.realname,'date':records.birthday.strftime('%Y-%m-%d')}) 
    
    
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json


#微信登录
@main.route('/wxlogin', methods=['GET', 'POST'])
def wxlogin():
    data=request.json
  
    ll = []
    nickName= data['userInfo']['nickName']
    avatarUrl=data['userInfo']['avatarUrl']
    userr = wxUser.query.first()
           
    if userr is None:
        ll.append({'zhu': 1})
        id=1
        if isnotemptywxuser():
           id=int(getmaxidwxuser())+1
        users = wxUser(id=id,wxusername=nickName,wxprofile=avatarUrl,money=0,moneyused=0,cash=0)
        db.session.add(users)
        db.session.commit
     
    else:
        ll.append({'zhu': 0})
        ll.append({'phone':userr.tel_number})
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

##微信登录2
@main.route('/wxphone', methods=['GET', 'POST'])
def wxphone():
    data=request.json
  
    ll = []
    username= data['username']
    phonenumber=data['phonenumber']
    users = wxUser.query.filter_by(wxusername=username).first()
    
    users.tel_number=phonenumber
    db.session.add(users)
    db.session.commit
   
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

##健康检测
@main.route('/check', methods=['GET', 'POST'])
def check():

    data=request.json
    idx=data['id']
    phone=data['phone']
    temps=data['temp']
    tempstwo=data['temptwo']
    diettemp=data['diettemp']
    statutemp=data['statutemp']



    ll = []
    users = User.query.filter_by(tel_number=phone).first()
    indicatorr=Indicator.query.filter_by(userid=users.id).first()    

    if indicatorr is None:
       id=1
       if isnotemptyindicator():
            id=int(getmaxidindicator())+1 
       if int(idx)==0:
             if float(temps)<20 or float(temps)>90:
                  ll.append({'info':0})
             else:
                  indicators=Indicator(id=id,userid=users.id,weight=temps)
                  db.session.add(indicators)
                  db.session.commit 
                  ll.append({'info':1})
       elif  int(idx)==1:
                if int(temps)<20 or int(temps)>260:
                       ll.append({'info':0})
                else:
                    indicators=Indicator(id=id,userid=users.id,heart=temps)
                    db.session.add(indicators)
                    db.session.commit 
                    ll.append({'info':1})           
             
       elif  int(idx)==2:
              if int(temps)>int(tempstwo):
                    if int(temps)<50 or int(temps)>180 or int(tempstwo)>120 or int(tempstwo)<30:
                        ll.append({'info':0})
                    else:
                        indicators=Indicator(id=id,userid=users.id,exblood=tempstwo,conblood=temps)
                        db.session.add(indicators)
                        db.session.commit 
                        ll.append({'info':1})  
              else:
                   ll.append({'info':0})     

       elif  int(idx)==5:

                if  int(temps)<1 or int(temps)>19:
                        ll.append({'info':0})
                else:
                        indicators=Indicator(id=id,userid=users.id,sleep=temps)
                        db.session.add(indicators)
                        db.session.commit 
                        ll.append({'info':1})  

       elif  int(idx)==6:
                        indicators=Indicator(id=id,userid=users.id,diet=diettemp)
                        db.session.add(indicators)
                        db.session.commit 
                        ll.append({'info':1})  
       elif  int(idx)==7:
                        indicators=Indicator(id=id,userid=users.id,statu=statutemp)
                        db.session.add(indicators)
                        db.session.commit 
                        ll.append({'info':1})                  
                          


            
       else: 
              if float(temps)<30 or float(temps)>45:
                   ll.append({'info':0})   
                          
              else:
                   indicators=Indicator(id=id,userid=users.id,temp=temps)
                   db.session.add(indicators)
                   db.session.commit
                   ll.append({'info':1})            
       

    else: 
       if int(idx)==0:
              if float(temps)<20 or float(temps)>150:
                  ll.append({'info':0})
              else:
                  indicatorr.weight=temps
                  db.session.add(indicatorr)
                  db.session.commit
                  ll.append({'info':1})
       elif  int(idx)==1:
                 if int(temps)<20 or int(temps)>260:
                       ll.append({'info':0})
                 else:
                      indicatorr.heart=temps
                      db.session.add(indicatorr)
                      db.session.commit
                      ll.append({'info':1})             
       elif  int(idx)==2:
              if int(temps)>int(tempstwo):
                    if int(temps)<50 or int(temps)>180 or int(tempstwo)>120 or int(tempstwo)<30:
                        ll.append({'info':0}) 
                    else:
                        indicatorr.exblood=tempstwo
                        indicatorr.conblood=temps
                        db.session.add(indicatorr)
                        db.session.commit
                        ll.append({'info':1})     
              else:
                   ll.append({'info':0})     

       elif  int(idx)==5:

                if  int(temps)<1 or int(temps)>19:
                        ll.append({'info':0})
                else:
                        indicatorr.sleep=temps 
                        db.session.add(indicatorr)
                        db.session.commit 
                        ll.append({'info':1})     

       elif  int(idx)==6:
                indicatorr.diet=diettemp
                db.session.add(indicatorr)
                db.session.commit 
                ll.append({'info':1}) 

       elif  int(idx)==7:
                indicatorr.statu=statutemp  
                db.session.add(indicatorr)
                db.session.commit 
                ll.append({'info':1})                           
             
       else:  
           if float(temps)<30 or float(temps)>45:
                   ll.append({'info':0})  
           else:
                   indicatorr.temp=temps    
                   db.session.add(indicatorr)
                   db.session.commit     
                   ll.append({'info':1})     
        
  
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

#健康检测数据查询
@main.route('/checkcha', methods=['GET', 'POST'])
def checkcha():
    

    ll = []
    data=request.json
    phone = data['phone']
    users = User.query.filter_by(tel_number=phone).first()
    indicators= Indicator.query.filter_by(userid=users.id).first()
    records=Record.query.filter_by(userid=users.id).first()

 
    if indicators is None:
       ll.append({'weight':'','heart':'','conblood':'','exblood':'','temp':'','diet':'','statu':'',
       'sleep':'','username':users.username})
    else:
       ll.append({'weight':indicators.weight,'heart':indicators.heart,'conblood':indicators.conblood,
       'exblood':indicators.exblood,'temp':indicators.temp,'sleep':indicators.sleep,'statu':indicators.statu,
       'diet':indicators.diet,'username':users.username
       }) 

    if records.sex is None:
         ll.append({'sex':'暂未设置'})
    else:
         sex='男' if records.sex else '女' 

         ll.append({'sex':sex})    
    
    
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json


from WXBizDataCrypt import WXBizDataCrypt
import requests
#微信计步
@main.route('/testst', methods=['GET', 'POST'])
def testst():

    ll=[]
    data=request.json
    appid='wx996ee0fd19218c1b'
    secret='776589b2c28a20bfdcd180dc64fea01e'
    code=data['code']
    headers={
        'User-Agent':'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.4033.400 QQBrowser/9.6.12624.400'
    }
    url='https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code'
    jsonn = requests.post(url,headers = headers).json()
    appId = 'wx996ee0fd19218c1b'
    sessionKey = jsonn['session_key']
    encryptedData = data['encryptedData']
    iv = data['iv']
    pc = WXBizDataCrypt(appId, sessionKey)
    print pc.decrypt(encryptedData, iv)
    ll=pc.decrypt(encryptedData, iv)
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

#目标步数设定
@main.route('/testmb', methods=['GET', 'POST'])
def testmb():

    ll=[]
    data=request.json
    step=data['step']
    phone = data['phone']
    users = User.query.filter_by(tel_number=phone).first()

    if users is None:
       id=1
       if isnotempty():
           id=int(getmaxid())+1
     
       usersr=User(id=id,step=step)
       db.session.add(usersr)
       db.session.commit

    else:
        users.step=step
        db.session.add(users)
        db.session.commit

    ll.append({'info':1}) 
    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json    

#目标步数查询
@main.route('/testmbcha', methods=['GET', 'POST'])
def testmbcha():
    ll = []
    data=request.json
    phone = data['phone']
    users = User.query.filter_by(tel_number=phone).first()
    
    if users.step  is None:  
       ll.append({'step':5000})

    else:
       ll.append({'step':users.step}) 


    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json   


#忘记密码
@main.route('/wangji', methods=['GET', 'POST'])
def wangji():
    ll = []
    data=request.json
    phone = data['phone']
    users = User.query.filter_by(tel_number=phone).first()
    
    if users  is None:  
       ll.append({'infowang':0})

    else:
       ll.append({'infowang':1}) 


    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json   

# 忘记密码验证
@main.route('/confyan', methods=['GET', 'POST'])
def confyan():

    data = request.json

    ll = []
    confirmcode = data['confirmcode']


    if confirmcode == "9706":
        ll.append({'info': 1})
     
    else:
        ll.append({'info': 0})

    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json

# 忘记密码重置
@main.route('/chongzhi', methods=['GET', 'POST'])
def chongzhi():

    data = request.json

    ll = []
    phone = data['phone']
    password = data['password']

    userr = User.query.filter_by(tel_number=phone).first()
    
    userr.password=password
    db.session.add(userr)
    db.session.commit

    ll.append({'xiuinfo': 1})


    encoded_json = json.dumps(ll, ensure_ascii=False)
    return encoded_json 






    


def isnotemptyindicator():
    count=Indicator.query.count()
    if count==0:
        return  False
    else:
        return True

def getmaxidindicator(): 
    import sqlite3
    conn=sqlite3.connect('C:\Users\ASS\Desktop\jiank\jiankpython\data.sqlite')
    cursor=conn.cursor()
    sql="select max(id) from health_indicator"
    result=cursor.execute(sql)
    temp=result.fetchall()
    cursor.close()
    return temp[0][0]


def isnotemptywxuser():
    count=wxUser.query.count()
    if count==0:
        return  False
    else:
        return True

def getmaxidwxuser(): 
    import sqlite3
    conn=sqlite3.connect('C:\Users\ASS\Desktop\jiank\jiankpython\data.sqlite')
    cursor=conn.cursor()
    sql="select max(id) from wxuser"
    result=cursor.execute(sql)
    temp=result.fetchall()
    cursor.close()
    return temp[0][0]

def isnotemptyuser():
    count=User.query.count()
    if count==0:
        return  False
    else:
        return True

def getmaxiduser(): 
    import sqlite3
    conn=sqlite3.connect('C:\Users\ASS\Desktop\jiank\jiankpython\data.sqlite')
    cursor=conn.cursor()
    sql="select max(id) from user"
    result=cursor.execute(sql)
    temp=result.fetchall()
    cursor.close()
    return temp[0][0]

def isnotempty():
    count=Record.query.count()
    if count==0:
        return  False
    else:
        return True

def getmaxid(): 
    import sqlite3
    conn=sqlite3.connect('C:\Users\ASS\Desktop\jiank\jiankpython\data.sqlite')
    cursor=conn.cursor()
    sql="select max(id) from health_record"
    result=cursor.execute(sql)
    temp=result.fetchall()
    cursor.close()
    return temp[0][0]




# #返回最新会务
# @main.route('/returnCurConf', methods=['GET', 'POST'])
# def returnCurNews():
#     query = Conference.query
#     pagination = query.order_by(Conference.timestamp.desc()).paginate(
#         1, per_page=current_app.config['FLASKY_POSTS_PER_PAGE'],
#         error_out=False)
#     conference = pagination.items
#     ll = []
#     for new in conference:
#         ll.append({'title': new.title,'file': new.files})

#     encoded_json = json.dumps(ll,ensure_ascii=False)
#     return encoded_json
# #微信提交数据信息
# @main.route('/returnGetData', methods=['GET', 'POST'])
# def GetData():
#     data = request.form.getlist("data")
#     #print data
#     datax = request.form.getlist("datax")
#     #print datax
#     ll = []
#     ll.append({'reason': 'res.data.reason',
#           'city_name': 'res.data.result.data.realtime.city_name',
#           'date': 'res.data.result.data.realtime.date',
#           'info': 'res.data.result.data.realtime.weather.info'})
#     encoded_json = json.dumps(ll,ensure_ascii=False)
#     return encoded_json

# @main.route('/getconference/<int:id>',methods=['GET','POST'])
# def GetConferenceinformation(id):
#     # query=Conference.query.filter(id=id)
#     # query=query.limit(1)
#     # confer=query
#     # # conferencetype=Types.query.filter_by(id=query.type_id).name
#     # ll=[]
#     # ll.append({'title':confer.title,'arrivingtime':confer.arrivingtime,'conftime':confer.conftime,'address':confer.address,'author':confer.author,'content':confer.content})
#     # encoded_json = json.dumps(ll,ensure_ascii=False)
#     # return encoded_json
#     # print(id)
#     # query = Conference.query.filter_by(id=id)
#     query = Conference.query.filter_by(id=id).first()
#     new = query
#     # print(new)
#     ll = []
#     # for new in conference:
#     ll.append({'title':new.title,'arrivingtime':new.arrivingtime,'conftime':new.conftime,'address':new.address,'author':new.author,'content':new.content})
#     ll[0]['arrivingtime']=ll[0]['arrivingtime'].strftime('%Y-%m-%d-%M-%S')
#     ll[0]['conftime']=ll[0]['conftime'].strftime('%Y-%m-%d-%M-%S')
#     encoded_json = json.dumps(ll,ensure_ascii=False)
#     return encoded_json

# @main.route('/returnSlideData', methods=['GET', 'POST'])
# def GetSlideData():
#     query = Conference.query.filter(' id >0 order by timestamp desc')
#     query = query.limit(3)

#     conference = query
#     ll = []
#     for new in conference:
#         ll.append({'title': new.title,'picurl': current_app.config['HOSTURL'] + current_app.config['UPLOAD_FOLDER'] + new.files})

#     encoded_json = json.dumps(ll,ensure_ascii=False)
#     return encoded_json

# @main.route('/returnChoiceList', methods=['GET', 'POST'])
# def GetChoiceList():
#     query = Conference.query.filter(' id >0 order by timestamp desc')
#     query = query.limit(10)
#     conference = query
#     ll = []
#     for new in conference:
#         ll.append({'title': new.title,'picurl': current_app.config['HOSTURL'] + current_app.config['UPLOAD_FOLDER'] + new.files,'id':new.id})

#     encoded_json = json.dumps(ll,ensure_ascii=False)
#     return encoded_json

# @main.route('/returnVenuesList', methods=['GET', 'POST'])
# def GetVenuesList():
#     query0 = Types.query.all()
#     ll = []
#     for type in query0:
#         query = Conference.query.filter(' type_id ='+  str(type.id)  +' order by timestamp desc')
#         query = query.limit(1)
#         conference = query
#         for new in conference:
#             ll.append({'title': new.title,'picurl': current_app.config['HOSTURL'] + current_app.config['UPLOAD_FOLDER'] + new.files,'id':new.id})

#     encoded_json = json.dumps(ll,ensure_ascii=False)
#     return encoded_json

# @main.route('/postData', methods=['GET', 'POST'])
# def postData():
#     data = request.json
#     title = data['title']
#     dep = data['dep']
#     phone = data['phone']
#     email = data['email']
#     userInfo = data['userInfo']
#     province = userInfo['province']
#     gender = userInfo['gender']
#     nickName = userInfo['nickName']
#     city = userInfo['city']
#     avatarUrl = userInfo['avatarUrl']

#     #print   title, dep,phone,email
#     #print userInfo
#     #print userInfo['province']

#     user = User(email=form.email.data,
#                     username=form.username.data,
#                     password=form.password.data)
#     db.session.add(user)
#     db.session.commit()

#     ll = []
#     ll.append({'successinfo':1})

#     encoded_json = json.dumps(ll,ensure_ascii=False)
#     return encoded_json
