# factories.py
import factory_boy
from app import db
from app.models import User, Employee, Workplace, Bento, Reservation

class Userfactory_boy(factory_boy.alchemy.SQLAlchemyModelfactory_boy):
    class Meta:
        model = User
        sqlalchemy_session = db.session

    id = factory_boy.Sequence(lambda n: n)
    password = factory_boy.Faker('password')
    role = factory_boy.Iterator(['admin', 'employee'])

class Employeefactory_boy(factory_boy.alchemy.SQLAlchemyModelfactory_boy):
    class Meta:
        model = Employee
        sqlalchemy_session = db.session

    id = factory_boy.Sequence(lambda n: n)
    name = factory_boy.Faker('name')
    location = factory_boy.Faker('city')

class Workplacefactory_boy(factory_boy.alchemy.SQLAlchemyModelfactory_boy):
    class Meta:
        model = Workplace
        sqlalchemy_session = db.session

    id = factory_boy.Sequence(lambda n: n)
    name = factory_boy.Faker('company')

class Bentofactory_boy(factory_boy.alchemy.SQLAlchemyModelfactory_boy):
    class Meta:
        model = Bento
        sqlalchemy_session = db.session

    id = factory_boy.Sequence(lambda n: n)
    name = factory_boy.Faker('sentence', nb_words=3)
    price = factory_boy.Faker('random_int', min=0, max=10000, step=100)

class Reservationfactory_boy(factory_boy.alchemy.SQLAlchemyModelfactory_boy):
    class Meta:
        model = Reservation
        sqlalchemy_session = db.session

    id = factory_boy.Sequence(lambda n: n)
    user_id = factory_boy.Subfactory_boy(Userfactory_boy)
    bento_id = factory_boy.Subfactory_boy(Bentofactory_boy)
    workplace_id = factory_boy.Subfactory_boy(Workplacefactory_boy)
    date = factory_boy.Faker('date_object')
