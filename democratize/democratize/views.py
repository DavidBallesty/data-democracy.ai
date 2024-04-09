from django.shortcuts import render
from django.http import JsonResponse

def landing_page(request):
    return render(request, 'landing_page.html')

def auto_analyze(request):
    return render(request, 'auto_analyze.html')

def scan_websites(request):
    return render(request, 'scan_websites.html')

def scan_images(request):
    return render(request, 'scan_images.html')


# ... other views

def get_globe_data(request):
    # Replace with actual data retrieval logic
    data = {
        'cities': [
            {'name': 'New York', 'lat': 40.7128, 'lon': -74.0060},
            # ... other cities
        ],
        'lines': [
            {'from': 'New York', 'to': 'London'},
            # ... other connections
        ],
    }
    return JsonResponse(data)
