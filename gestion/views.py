from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def login_success(request):
    return render(request, 'login_success.html')