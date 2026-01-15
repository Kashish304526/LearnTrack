from datetime import date, timedelta
import models

def update_user_streak(user: models.User):
    today = date.today()

    # Case 1: first ever completion
    if user.last_completed_date is None:
        user.current_streak = 1

    # Case 2: already completed today → no change
    elif user.last_completed_date == today:
        return

    # Case 3: consecutive day
    elif user.last_completed_date == today - timedelta(days=1):
        user.current_streak += 1

    # Case 4: missed one or more days
    else:
        user.current_streak = 1

    user.last_completed_date = today
