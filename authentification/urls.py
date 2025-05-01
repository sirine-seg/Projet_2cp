from django.urls import path
from .views import GoogleLogin, GoogleCodeExchangeView

urlpatterns = [
    path('dj-rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('google-code-exchange/', GoogleCodeExchangeView.as_view(), name='google_code_exchange'),
    # for Authorization Code Grant

]

