from pydantic import BaseModel

class PaymentIntentRequest(BaseModel):
    amount: int  # in cents

class PaymentIntentResponse(BaseModel):
    client_secret: str
