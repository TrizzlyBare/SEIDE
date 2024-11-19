from sqlalchemy.orm import Session
from models import Base, engine, User, pwd_context

# Create a new database session
db = Session(bind=engine)

# Hard-code the admin email and password
admin_email = "admin@testing.com"
admin_password = "admin"

# Hash the admin password
hashed_password = pwd_context.hash(admin_password)

# Create the admin user
admin_user = User(email=admin_email, hashed_password=hashed_password)

# Add the admin user to the session and commit
db.add(admin_user)
db.commit()

print("Admin user created successfully")