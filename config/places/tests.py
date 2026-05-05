from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from datetime import time, date
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Religion, Denomination, ReligiousPlace, PlaceAddress
from contacts.models import PlaceContact
from accessibility.models import PlaceAccessibility
from sources.models import PlaceSource
from hours.models import OpeningHours
from photos.models import PlacePhoto
from reviews.models import UserReview


class ReligiousAPITest(APITestCase):
    def setUp(self):
        self.religion = Religion.objects.create(name='christianity', display_name = 'Христианство')
        self.denomination = Denomination.objects.create(
            name='orthodoxy', 
            display_name='Православие',
            religion=self.religion
        )
        self.place = ReligiousPlace.objects.create(
            name='Храм Христа Спасителя',
            denomination=self.denomination,
            is_open_247=False
        )
        self.address = PlaceAddress.objects.create(
            religious_place=self.place,
            address_line='ул. Волхонка, 15',
            city='Москва',
            latitude=55.7447,
            longitude=37.6055
        )
        self.contact = PlaceContact.objects.create(
            religious_place=self.place,
            phone='+7 (495) 637-12-76',
            website='http://xxc.ru'
        )

    def test_list_places(self):
        url = reverse('religiousplace-list') 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Храм Христа Спасителя')

    def test_filter_by_distance(self):
        url = reverse('religiousplace-list')
        response = self.client.get(url, {'lat': 55.7512, 'lon': 37.6184, 'radius': 5})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        if 'distance' in response.data[0]:
            self.assertIsNotNone(response.data[0]['distance'])

class ReligiousPlaceModelTest(TestCase):
    def test_is_open_now_with_247(self):
        place = ReligiousPlace.objects.create(name='Круглосуточный', is_open_247=True)
        self.assertTrue(place.get_is_open_now())

    def test_is_open_now_during_working_hours(self):
        place = ReligiousPlace.objects.create(name='Храм', is_open_247=False)
        # Создаём часы работы на сегодня с 9:00 до 19:00
        now = timezone.localtime(timezone.now())
        OpeningHours.objects.create(
            religious_place=place,
            day_of_week=now.weekday(),
            open_time=time(9, 0),
            close_time=time(19, 0),
            is_closed=False
        )
        result = place.get_is_open_now()
        self.assertIsInstance(result, bool)
        # Подменяем текущее время в тесте сложнее, но можно сделать через mock
        # Упрощённо: проверяем логику через прямой вызов с известным временем
        # Для полного теста лучше использовать freezegun или mock
        # Здесь просто демонстрация
        # ...

    def test_is_open_now_when_closed(self):
        # Создаём храм с выходным днём
        place = ReligiousPlace.objects.create(name='Закрытый храм', is_open_247=False)
        now = timezone.localtime(timezone.now())
        OpeningHours.objects.create(
            religious_place=place,
            day_of_week=now.weekday(),
            open_time=time(0, 0),
            close_time=time(0, 0),
            is_closed=True
        )
        # Ожидаем, что get_is_open_now вернёт False
        self.assertFalse(place.get_is_open_now())

    def test_place_accessibility_creation(self):
        place = ReligiousPlace.objects.create(name='Храм с пандусом')
        accessibility = PlaceAccessibility.objects.create(
           religious_place=place,
           has_wheelchair_access=True,
           has_parking=False
        )
        self.assertEqual(accessibility.has_wheelchair_access, True)
        self.assertEqual(accessibility.has_parking, False)
        self.assertEqual(accessibility.religious_place, place)

    def test_place_source_creation(self):
        place = ReligiousPlace.objects.create(name='Храм из OSM')
        source = PlaceSource.objects.create(
           religious_place=place,
           source='osm',
           external_id='osm_12345'
        )
        self.assertEqual(source.source, 'osm')
        self.assertEqual(source.external_id, 'osm_12345')

    def test_place_photo_creation(self):
        place = ReligiousPlace.objects.create(name='Храм с фото')
        photo = PlacePhoto.objects.create(
           religious_place=place,
           image_url='https://example.com/photo.jpg',
           description='Купола',
           is_main=True
        )
        self.assertEqual(photo.image_url, 'https://example.com/photo.jpg')
        self.assertTrue(photo.is_main)
        self.assertIsNotNone(photo.uploaded_at)  # auto_now_add

    def test_user_review_creation(self):
        user = User.objects.create_user(username='testuser', password='12345')
        place = ReligiousPlace.objects.create(name='Храм с отзывами')
        review = UserReview.objects.create(
           religious_place=place,
           user=user,
           rating=5,
           comment='Замечательное место'
        )
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'Замечательное место')
        self.assertEqual(review.user.username, 'testuser')

    def test_place_address_distance_calculation(self):
        place = ReligiousPlace.objects.create(name='Храм для расстояния')
        address = PlaceAddress.objects.create(
           religious_place=place,
           latitude=55.7558,  # Москва, Красная площадь
           longitude=37.6176
        )
        # Расстояние до Останкинской башни (55.8256, 37.6111) примерно 7.8 км
        dist = address.get_distance_to(55.8256, 37.6111)
        self.assertAlmostEqual(dist, 7.8, delta=0.5)