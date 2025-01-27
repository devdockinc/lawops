# Generated by Django 4.2.11 on 2024-05-20 20:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="AssuntoNormalizadoEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("id_escavador", models.IntegerField()),
                (
                    "nome",
                    models.CharField(
                        blank=True, default=None, max_length=512, null=True
                    ),
                ),
                (
                    "nome_com_pai",
                    models.CharField(
                        blank=True, default=None, max_length=512, null=True
                    ),
                ),
                (
                    "path_completo",
                    models.CharField(
                        blank=True, default=None, max_length=512, null=True
                    ),
                ),
            ],
            options={
                "verbose_name": "Assunto Normalizado",
                "verbose_name_plural": "Assuntos Normalizados",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="EnvolvidoEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("nome", models.CharField(blank=True, max_length=512, null=True)),
                ("quantidade_processos", models.IntegerField()),
                (
                    "tipo_pessoa",
                    models.CharField(
                        choices=[("F", "Física"), ("J", "Jurídica")], max_length=1
                    ),
                ),
                ("prefixo", models.CharField(blank=True, max_length=255, null=True)),
                ("sufixo", models.CharField(blank=True, max_length=255, null=True)),
                ("tipo", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "tipo_normalizado",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("polo", models.CharField(blank=True, max_length=255, null=True)),
                ("cpf", models.CharField(blank=True, max_length=11, null=True)),
                ("cnpj", models.CharField(blank=True, max_length=14, null=True)),
            ],
            options={
                "verbose_name": "Envolvido",
                "verbose_name_plural": "Envolvido",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="EstadosEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("nome", models.CharField(max_length=255)),
                ("sigla", models.CharField(max_length=2)),
            ],
            options={
                "verbose_name": "Estado",
                "verbose_name_plural": "Estados",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="InformacaoComplementarEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("tipo", models.CharField(max_length=512)),
                ("valor", models.TextField()),
            ],
            options={
                "verbose_name": "Informação Complementar",
                "verbose_name_plural": "Informações Complementares",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="MovimentacaoFonteEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("fonte_id", models.IntegerField()),
                ("nome", models.CharField(max_length=512)),
                ("tipo", models.CharField(max_length=50)),
                ("sigla", models.CharField(max_length=50)),
                ("grau", models.CharField(max_length=10)),
                ("grau_formatado", models.CharField(max_length=255)),
                ("caderno", models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                "verbose_name": "MovimentacaoFonte",
                "verbose_name_plural": "MovimentacaoFonte",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="OabEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("numero", models.CharField(max_length=255)),
                ("uf", models.CharField(max_length=2)),
                ("tipo", models.CharField(max_length=255)),
            ],
            options={
                "verbose_name": "Oab",
                "verbose_name_plural": "Oab",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="ProcessoEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("numero_cnj", models.CharField(max_length=50, unique=True)),
                (
                    "titulo_polo_ativo",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "titulo_polo_passivo",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                ("ano_inicio", models.CharField(max_length=4)),
                ("data_inicio", models.CharField(blank=True, max_length=50, null=True)),
                (
                    "data_ultima_movimentacao",
                    models.CharField(blank=True, max_length=50, null=True),
                ),
                (
                    "quantidade_movimentacoes",
                    models.IntegerField(blank=True, null=True),
                ),
                (
                    "fontes_tribunais_estao_arquivadas",
                    models.BooleanField(default=False),
                ),
                ("data_ultima_verificacao", models.CharField(max_length=50)),
                ("tempo_desde_ultima_verificacao", models.CharField(max_length=255)),
                (
                    "estado_origem",
                    models.ForeignKey(
                        blank=True,
                        default=None,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.estadosescavador",
                    ),
                ),
            ],
            options={
                "verbose_name": "Processo",
                "verbose_name_plural": "Processo",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="ProcessoFonteCapaEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("classe", models.CharField(max_length=512)),
                ("assunto", models.CharField(blank=True, max_length=512, null=True)),
                ("area", models.CharField(blank=True, max_length=512, null=True)),
                (
                    "orgao_julgador",
                    models.CharField(blank=True, max_length=512, null=True),
                ),
                (
                    "data_distribuicao",
                    models.CharField(blank=True, max_length=10, null=True),
                ),
                (
                    "data_arquivamento",
                    models.CharField(blank=True, max_length=10, null=True),
                ),
                (
                    "assunto_principal_normalizado",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.assuntonormalizadoescavador",
                    ),
                ),
            ],
            options={
                "verbose_name": "Processo Fonte Capa",
                "verbose_name_plural": "Processos Fonte Capa",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="TribunalEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("id_escavador", models.IntegerField()),
                ("nome", models.CharField(max_length=255)),
                ("sigla", models.CharField(max_length=255)),
                (
                    "categoria",
                    models.CharField(
                        blank=True, default=None, max_length=255, null=True
                    ),
                ),
            ],
            options={
                "verbose_name": "Tribunal",
                "verbose_name_plural": "Tribunais",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="ValorCausaEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("valor", models.CharField(max_length=255)),
                ("moeda", models.CharField(max_length=255)),
                ("valor_formatado", models.CharField(max_length=255)),
            ],
            options={
                "verbose_name": "Valor Causa",
                "verbose_name_plural": "Valores Causa",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="TribunalEstadosEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "estado",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.estadosescavador",
                    ),
                ),
                (
                    "tribunal",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.tribunalescavador",
                    ),
                ),
            ],
            options={
                "verbose_name": "Tribunal Estado",
                "verbose_name_plural": "Tribunais Estados",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="ProcessoFonteEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("id_escavador", models.IntegerField(unique=True)),
                ("processo_fonte_id", models.IntegerField(unique=True)),
                ("descricao", models.CharField(max_length=255)),
                ("nome", models.CharField(max_length=255)),
                ("sigla", models.CharField(max_length=10)),
                ("tipo", models.CharField(max_length=255)),
                ("data_inicio", models.CharField(blank=True, max_length=10, null=True)),
                ("data_ultima_movimentacao", models.CharField(max_length=10)),
                ("segredo_justica", models.BooleanField(blank=True, null=True)),
                ("arquivado", models.BooleanField(blank=True, null=True)),
                (
                    "status_predito",
                    models.CharField(
                        choices=[("A", "Ativo"), ("I", "Inativo")], max_length=1
                    ),
                ),
                ("grau", models.CharField(max_length=255)),
                ("grau_formatado", models.CharField(max_length=255)),
                ("fisico", models.BooleanField()),
                ("sistema", models.CharField(max_length=255)),
                ("url", models.CharField(max_length=1024)),
                ("quantidade_movimentacoes", models.IntegerField()),
                ("data_ultima_verificacao", models.CharField(max_length=30)),
                ("caderno", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "capa",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.processofontecapaescavador",
                    ),
                ),
                (
                    "processo",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.processoescavador",
                    ),
                ),
                (
                    "tribunal",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.tribunalescavador",
                    ),
                ),
            ],
            options={
                "verbose_name": "ProcessoFonte",
                "verbose_name_plural": "ProcessoFonte",
                "ordering": ["-id"],
            },
        ),
        migrations.AddField(
            model_name="processofontecapaescavador",
            name="valor",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="escavador.valorcausaescavador",
            ),
        ),
        migrations.CreateModel(
            name="OabEnvolvido",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "envolvido",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.envolvidoescavador",
                    ),
                ),
                (
                    "oab",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.oabescavador",
                    ),
                ),
            ],
            options={
                "verbose_name": "Oab Envolvido",
                "verbose_name_plural": "Oab Envolvidos",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="MovimentacaoEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("id_escavador", models.IntegerField()),
                ("data", models.CharField(max_length=10)),
                ("tipo", models.CharField(max_length=255)),
                ("conteudo", models.TextField()),
                (
                    "fonte",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.movimentacaofonteescavador",
                    ),
                ),
                (
                    "processo",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.processoescavador",
                    ),
                ),
            ],
            options={
                "verbose_name": "Movimentacao",
                "verbose_name_plural": "Movimentacao",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="InformacaoComplementarProcessoFonteCapaEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "informacao_complementar",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.informacaocomplementarescavador",
                    ),
                ),
                (
                    "processo_fonte_capa",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.processofontecapaescavador",
                    ),
                ),
            ],
            options={
                "verbose_name": "Informação Complementar Processo Fonte Capa",
                "verbose_name_plural": "Informações Complementares Processo Fonte Capa",
                "ordering": ["-id"],
            },
        ),
        migrations.CreateModel(
            name="EnvolvidosProcessoFonteEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "envolvido",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.envolvidoescavador",
                    ),
                ),
                (
                    "processo_fonte",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.processofonteescavador",
                    ),
                ),
            ],
            options={
                "verbose_name": "Envolvido Processo Fonte",
                "verbose_name_plural": "Envolvidos Processo Fonte",
                "ordering": ["-id"],
            },
        ),
        migrations.AddField(
            model_name="envolvidoescavador",
            name="processo",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="escavador.processoescavador",
            ),
        ),
        migrations.CreateModel(
            name="AssuntoNormalizadoProcessoFonteCapaEscavador",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "assunto_normalizado",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.assuntonormalizadoescavador",
                    ),
                ),
                (
                    "processo_fonte_capa",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="escavador.processofontecapaescavador",
                    ),
                ),
            ],
            options={
                "verbose_name": "Assunto Normalizado Processo Fonte Capa",
                "verbose_name_plural": "Assuntos Normalizados Processo Fonte Capa",
                "ordering": ["-id"],
            },
        ),
    ]
