from django.shortcuts import render

def landing_page(request):
    return render(request, 'landing_page.html')

def auto_analyze(request):
    return render(request, 'auto_analyze.html')

def scan_websites(request):
    return render(request, 'scan_websites.html')

def scan_images(request):
    return render(request, 'scan_images.html')
