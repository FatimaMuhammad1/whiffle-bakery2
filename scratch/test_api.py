import sys
sys.path.append('d:/project/Bakery-whiffly-FINAL')
from fastapi.testclient import TestClient
from app.main import app
from app.models.user import User

def main():
    client = TestClient(app)
    
    from app.dependencies.auth import get_current_user
    
    async def override_get_current_user():
        return User(id="123e4567-e89b-12d3-a456-426614174000", email="test@test.com", role="user")

    app.dependency_overrides[get_current_user] = override_get_current_user
    
    response = client.post("/api/v1/orders/create-payment-intent", json={"amount": 1000})
    print("Status Code:", response.status_code)
    print("Response JSON:", response.text)

if __name__ == "__main__":
    main()
