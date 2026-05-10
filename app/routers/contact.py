from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.services.email_service import EmailService

router = APIRouter(prefix="/contact", tags=["Contact"])

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

@router.post("/")
async def send_contact(form: ContactForm):
    try:
        await EmailService.send_contact_email(
            name=form.name,
            email_from=form.email,
            subject=form.subject,
            message_body=form.message
        )
        return {"message": "Message sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to send email: {str(e)}")
