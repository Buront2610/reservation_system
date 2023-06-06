from app import create_app, db
from app.models import User, Workplace, Bento, Reservation, Exclude, TimeFlag

app = create_app()
with app.app_context():
    # 各モデルの全てのレコードを取得し、表示します。
    users = User.query.all()
    print("Users:")
    for user in users:
        print(user.id, user.name, user.password, user.workplace_id)

    workplaces = Workplace.query.all()
    print("\nWorkplaces:")
    for workplace in workplaces:
        print(workplace.id, workplace.name, workplace.location)

    bentos = Bento.query.all()
    print("\nBentos:")
    for bento in bentos:
        print(bento.id, bento.name, bento.price, bento.choose_flag)

    reservations = Reservation.query.all()
    print("\nReservations:")
    for reservation in reservations:
        print(reservation.id, reservation.user_id, reservation.bento_id, reservation.reservation_date, reservation.quantity, reservation.remarks)

    excludes = Exclude.query.all()
    print("\nExcludes:")
    for exclude in excludes:
        print(exclude.id, exclude.exclude_date)

    time_flags = TimeFlag.query.all()
    print("\nTimeFlags:")
    for time_flag in time_flags:
        print(time_flag.id, time_flag.time_flag)
