# Generated by Django 4.2.11 on 2024-08-23 16:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("escavador", "0007_remove_movimentacaoescavador_fonte_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="processofonteescavador",
            name="processo",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="processo_fonte",
                to="escavador.processoescavador",
            ),
        ),
    ]
