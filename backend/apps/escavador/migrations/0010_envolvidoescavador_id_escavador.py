# Generated by Django 4.2.15 on 2024-09-03 10:54

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("escavador", "0009_alter_movimentacaoescavador_id_escavador"),
    ]

    operations = [
        migrations.AddField(
            model_name="envolvidoescavador",
            name="id_escavador",
            field=models.PositiveBigIntegerField(blank=True, null=True),
        ),
    ]
