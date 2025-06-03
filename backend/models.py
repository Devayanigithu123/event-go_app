from django.db import models

# Create your models here.

class Event(models.Model):
    name = models.CharField(max_length=255)
    date = models.DateField()
    location = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Ticket(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    attendee_name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.attendee_name} - {self.event.name}"
