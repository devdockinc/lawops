# Generated by Django 4.2.11 on 2024-05-27 11:19

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("escavador", "0005_alter_envolvidoescavador_processo"),
    ]

    operations = [
        migrations.AlterField(
            model_name="processofonteescavador",
            name="id_escavador",
            field=models.IntegerField(),
        ),
    ]
