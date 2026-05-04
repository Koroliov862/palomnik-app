from django.test import TestCase
from django.db import IntegrityError
from religions.models import Religion
from .models import Denomination

class DenominationModelTest(TestCase):
    def setUp(self):
        self.religion = Religion.objects.create(
            name='christianity',
            display_name='Христианство'
        )

    def test_create_denomination(self):
        denom = Denomination.objects.create(
            name='orthodoxy',
            display_name='Православие',
            religion=self.religion
        )
        self.assertEqual(denom.name, 'orthodoxy')
        self.assertEqual(denom.display_name, 'Православие')
        self.assertEqual(denom.religion, self.religion)
        self.assertEqual(str(denom), 'Православие')

    def test_denomination_name_unique(self):
        Denomination.objects.create(
            name='catholicism',
            display_name='Католицизм',
            religion=self.religion
        )
        with self.assertRaises(IntegrityError):
            Denomination.objects.create(
                name='catholicism',
                display_name='Римско-католическая церковь',
                religion=self.religion
            )

    def test_denomination_religion_relation(self):
        denom = Denomination.objects.create(
            name='buddhism_mahayana',
            display_name='Махаяна',
            religion=self.religion
        )
        # проверяем обратную связь: религия -> деноминации
        self.assertIn(denom, self.religion.denominations.all())

    def test_on_delete_cascade(self):
        denom = Denomination.objects.create(
            name='protestantism',
            display_name='Протестантизм',
            religion=self.religion
        )
        self.religion.delete()
        self.assertFalse(Denomination.objects.filter(id=denom.id).exists())