from django.test import TestCase
from django.contrib.auth.models import User
from places.models import ReligiousPlace
from reviews.models import UserReview

class UserReviewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password = '12345')
        self.place = ReligiousPlace.objects.create(name='Храм')

    def test_create_review_updates_rating(self):
        review = UserReview.objects.create(
            religious_place=self.place,
            user=self.user,
            rating=5,
            comment='Отлично'
        )
        self.place.refresh_from_db()
        self.assertEqual(self.place.average_rating, 5.0)
        self.assertEqual(self.place.ratings_count, 1)

    def test_delete_review_updates_rating(self):
        review = UserReview.objects.create(
            religious_place=self.place,
            user=self.user,
            rating=3,
            comment='Нормально'
        )
        self.place.refresh_from_db()
        self.assertEqual(self.place.average_rating, 3.0)
        review.delete()
        self.place.refresh_from_db()
        self.assertEqual(self.place.average_rating, 0.0)
        self.assertEqual(self.place.ratings_count, 0)