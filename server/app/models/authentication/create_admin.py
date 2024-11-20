from sqlalchemy.orm import Session
from models import Base, engine, User, pwd_context

db = Session(bind=engine)

admin_email = "admin@testing.com"
admin_password = "admin"

hashed_password = pwd_context.hash(admin_password)

# Create the admin user
admin_user = User(email=admin_email, hashed_password=hashed_password)

db.add(admin_user)
db.commit()

print("Admin user created successfully")