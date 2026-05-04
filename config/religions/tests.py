from django.test import TestCase
from django.db import IntegrityError
from .models import Religion

class ReligionModelTest(TestCase):
    def test_create_religion(self):
        religion = Religion.objects.create(
            name='christianity',
            display_name='Христианство'
        )
        self.assertEqual(religion.name, 'christianity')
        self.assertEqual(religion.display_name, 'Христианство')
        self.assertEqual(str(religion), 'Христианство')

    def test_religion_name_unique(self):
        Religion.objects.create(name='islam', display_name='Ислам')
        with self.assertRaises(IntegrityError):
            Religion.objects.create(name='islam', display_name='Мусульманство')