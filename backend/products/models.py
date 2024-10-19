from django.db import models

class Product(models.Model):
    product_name = models.CharField(max_length=255)
    product_category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    description = models.TextField()

    def __str__(self):
        return self.product_name
