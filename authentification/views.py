from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from dj_rest_auth.jwt_auth import set_jwt_access_cookie, set_jwt_refresh_cookie

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

        url = "https://esi-track-deployement.onrender.com/api/auth/dj-rest-auth/google/"
        try:
            google_res = requests.post(url, json={'code': code})
            google_res.raise_for_status()  # Raise an exception for HTTP errors
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Failed to connect to Google API: {str(e)}"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Check if the response contains the required keys
        try:
            response_data = google_res.json()
            access_token = response_data["access"]
            refresh_token = response_data["refresh"]
        except (KeyError, ValueError) as e:
            return Response({"error": "Invalid response from Google API"},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Create the response and set cookies
        res = Response(
            {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "detail": "Successfully retrieved tokens"
            },
            status=status.HTTP_200_OK
        )
        set_jwt_access_cookie(res, access_token)
        set_jwt_refresh_cookie(res, refresh_token)
        return res
