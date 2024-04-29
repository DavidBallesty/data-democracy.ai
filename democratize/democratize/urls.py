from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing_page, name='landing_page'),
    path('auto-analyze/', views.auto_analyze, name='auto_analyze'),
    path('scan-websites/', views.scan_websites, name='scan_websites'),
    path('scan-images/', views.scan_images, name='scan_images'),
    path('get-globe-data/', views.get_globe_data, name='get_globe_data'),
]