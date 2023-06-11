from app import create_app, db
from app.models import User, Workplace, Bento, Reservation, Exclude, TimeFlag
from werkzeug.security import generate_password_hash
from datetime import date, timedelta
import random
import string

app = create_app()
with app.app_context():
    # Remove all existing data
    TimeFlag.query.delete()
    Exclude.query.delete()
    Reservation.query.delete()
    Bento.query.delete()
    User.query.delete()
    Workplace.query.delete()

    # Add test data to the database
    workplace = Workplace(name='Office1', location='Tokyo')
    db.session.add(workplace)
    db.session.commit()

    users = []
    for i in range(10):  # Create 10 users
        random_password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))  # Generate a random password
        hashed_password = generate_password_hash(random_password)  # Hashing
        user = User(
            password=hashed_password, 
            role=random.choice(['admin', 'user']),  # Select a random role
            name=f'User{i}', 
            email_address=f'user{i}@example.com', 
            telephone=''.join(random.choices(string.digits, k=10)),  # Generate a random 10-digit phone number
            hide_flag=False, 
            workplace_id=1
        )
        db.session.add(user)
        users.append(user)
    db.session.commit()

    bentos = []
    for i in range(5):  # Create 5 bento options
        bento = Bento(name=f'Bento{i+1}', price=random.randint(300, 1000), choose_flag=True)
        db.session.add(bento)
        bentos.append(bento)
    db.session.commit()

    for _ in range(50):  # Create 50 reservations
        reservation = Reservation(
            user_id=random.choice(users).id, 
            bento_id=random.choice(bentos).id, 
            reservation_date=date.today() + timedelta(days=random.randint(0, 10)), 
            quantity=random.randint(1, 5), 
            remarks=random.choice(['No onions', 'Extra meat', 'No soy sauce', '']))
        db.session.add(reservation)
    db.session.commit()

    exclude = Exclude(exclude_date=date.today())
    db.session.add(exclude)
    db.session.commit()

    time_flag = TimeFlag(time_flag=1)
    db.session.add(time_flag)
    db.session.commit()
