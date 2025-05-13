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

    def post(self, request):  # ✅ Use lowercase `post` not `POST`
        code = request.data.get('code')
        print(f"Received code: {code}")

        url = "https://esi-track-deployement.onrender.com/api/auth/dj-rest-auth/google/"

        google_res = requests.post(url, json={'code': code})
        if google_res.status_code == status.HTTP_200_OK:
            access_token = google_res.json()["access"]
            refresh_token = google_res.json()["refresh"]
            print(access_token)
            print(refresh_token)
            res = Response(
                {
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "detail": "able to get the token"
                },
                status=status.HTTP_200_OK
            )
            set_jwt_access_cookie(res, access_token)
            set_jwt_refresh_cookie(res, refresh_token)
            print(f"Response: {res.data}")
            return res
