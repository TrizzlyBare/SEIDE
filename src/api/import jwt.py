import jwt
from sqlalchemy.orm import Session


users = {}
SECRET_KEY = "johnny"
ALGORITHM = "HS256"


def register(user,passw):
    if user in users.keys():
        return False
    users[user] = passw
    return True


def login(user,passw):
    usr = users.get(user)
    if not usr:
        return False
    # compare passwd
    if passw != usr:
        return False
    return gen_jwt(user,"NEXT LIFE")

def gen_jwt(user,time):
    return jwt.encode({
        "user": user,
        "expire": time
    }, SECRET_KEY, algorithm=ALGORITHM)

def validate_jwt(jwt_data):
    payload = jwt.decode(jwt_data, SECRET_KEY, algorithms=[ALGORITHM])
    return payload