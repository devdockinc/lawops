# Generated by Django 4.2.15 on 2024-09-18 00:48

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("escavador", "0010_envolvidoescavador_id_escavador"),
    ]

    operations = [
        migrations.AlterField(
            model_name="assuntonormalizadoescavador",
            name="id_escavador",
            field=models.PositiveBigIntegerField(),
        ),
        migrations.AlterField(
            model_name="movimentacaoescavador",
            name="fonte_id",
            field=models.PositiveBigIntegerField(blank=True, default=None, null=True),
        ),
        migrations.AlterField(
            model_name="processofonteescavador",
            name="id_escavador",
            field=models.PositiveBigIntegerField(),
        ),
        migrations.AlterField(
            model_name="processofonteescavador",
            name="processo_fonte_id",
            field=models.PositiveBigIntegerField(),
        ),
        migrations.AlterField(
            model_name="tribunalescavador",
            name="id_escavador",
            field=models.PositiveBigIntegerField(),
        ),
    ]
