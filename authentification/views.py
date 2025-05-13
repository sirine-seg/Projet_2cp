from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from dj_rest_auth.jwt_auth import set_jwt_access_cookie, set_jwt_refresh_cookie
from dj_rest_auth.views import GoogleLogin as DjRestAuthGoogleLogin

import requests


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    # postmessage if using auth-code with @react-oauth/google
    callback_url = "postmessage"
    client_class = OAuth2Client


class GoogleCodeExchangeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({"error": "Code is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a modified request with the code in the format expected by GoogleLogin
        modified_request = request
        modified_request.data = {'code': code}

        # Use the GoogleLogin view directly
        google_login = DjRestAuthGoogleLogin.as_view()
        response = google_login(modified_request)

        # If the response was successful, return the tokens in the format expected by your frontend
        if response.status_code == 200:
            return Response({
                "access_token": response.data.get("access_token"),
                "refresh_token": response.data.get("refresh_token"),
                "detail": "Authentication successful"
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Authentication failed"}, status=response.status_code)
