from django.contrib import admin

from apps.parameter.models import Parameter

admin.site.register(Parameter, admin.ModelAdmin)
