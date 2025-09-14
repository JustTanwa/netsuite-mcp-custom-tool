import base64
import datetime
from dotenv import load_dotenv
import logging
import os
import requests
import jwt
import argparse
import sys
from cryptography.hazmat.primitives import serialization

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

class NetSuiteOAuth2:
    def __init__(self):
        self.client_id = os.getenv("REST_CLIENTID")
        self.client_secret = os.getenv("REST_CLIENTSECRET")
        self.account_id = os.getenv("ACCOUNT_ID")
        self.base_url = f"https://{os.getenv('ACCOUNT_ID')}.suitetalk.api.netsuite.com"
        self.access_token = None

    def _load_private_key(self):
        private_key_content = os.getenv("REST_PRIVATE_KEY")
        
        if not private_key_content:
            private_key_path = os.getenv("REST_PRIVATE_KEY_PATH")
            if private_key_path and os.path.exists(private_key_path):
                with open(private_key_path, 'r') as f:
                    private_key_content = f.read()
            else:
                raise ValueError("Private key not found in environment variables or file")
        
        if not private_key_content.startswith('-----BEGIN'):
            try:
                private_key_content = base64.b64decode(private_key_content).decode('utf-8')
            except Exception:
                pass
        
        return serialization.load_pem_private_key(
            private_key_content.encode('utf-8'),
            password=None
        )

    def _create_jwt_assertion(self):
        now = datetime.datetime.now(datetime.timezone.utc)
        
        header = {
            "typ": "JWT",
            "alg": "PS256",
            "kid": os.getenv("REST_KID")
        }

        payload = {
            "iss": self.client_id,
            "scope": "restlets",
            "aud": f"{self.base_url}/services/rest/auth/oauth2/v1/token",
            "exp": int((now + datetime.timedelta(minutes=5)).timestamp()),
            "iat": int(now.timestamp())
        }

        try:
            private_key = self._load_private_key()
            
            token = jwt.encode(
                payload,
                private_key,
                algorithm="PS256",
                headers=header
            )
            
            return token
            
        except Exception as e:
            logger.error(f"Error creating JWT assertion: {str(e)}")
            raise

    def get_access_token(self):
        try:
            grant_type = 'client_credentials'
            client_assertion_type = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
            client_assertion = self._create_jwt_assertion()

            data = {
                'grant_type': grant_type,
                'client_assertion_type': client_assertion_type,
                'client_assertion': client_assertion
            }

            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }

            token_url = f"{self.base_url}/services/rest/auth/oauth2/v1/token"
            
            logger.info(f"Requesting access token from: {token_url}")
            
            response = requests.post(
                token_url,
                data=data,
                headers=headers,
                timeout=30
            )

            if response.status_code == 200:
                token_data = response.json()
                self.access_token = token_data.get('access_token')
                
                logger.info("Successfully obtained access token")
                return self.access_token
            else:
                logger.error(f"Token request failed: {response.status_code}")
                logger.error(f"Response: {response.text}")
                response.raise_for_status()

        except requests.exceptions.RequestException as e:
            logger.error(f"Request error during token acquisition: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during token acquisition: {str(e)}")
            raise

def main():
    parser = argparse.ArgumentParser(description='Get NetSuite access token for use with curl')
    parser.add_argument(
        '--export',
        action='store_true',
        help='Export token as environment variable'
    )
    parser.add_argument(
        '--token-only',
        action='store_true',
        help='Only print the token value'
    )

    args = parser.parse_args()

    try:
        oauth_client = NetSuiteOAuth2()
        token = oauth_client.get_access_token()
        
        if args.token_only:
            print(token)
        elif args.export:
            print(f'export NETSUITE_ACCESS_TOKEN="{token[:20]}"')
            print(f'export NETSUITE_BASE_URL="{oauth_client.base_url}"')
        else:
            print(f"Access token: {token}")
            print(f"Base URL: {oauth_client.base_url}")
            print("\nTo use with curl:")
            print(f'export NETSUITE_ACCESS_TOKEN="{token}"')
            print(f'export NETSUITE_BASE_URL="{oauth_client.base_url}"')
            print("\nExample curl command:")
            print('curl -H "Authorization: Bearer $NETSUITE_ACCESS_TOKEN" \\')
            print('     -H "Content-Type: application/json" \\')
            print('     -X POST \\')
            print('     -d \'{"companyName": "Test Corp"}\' \\')
            print('     "$NETSUITE_BASE_URL/services/rest/record/v1/customer"')
        
        return 0
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())