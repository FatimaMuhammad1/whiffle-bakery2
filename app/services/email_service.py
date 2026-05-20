"""
app/services/email_service.py
─────────────────────────────
Service for sending emails using fastapi-mail and SMTP.
"""
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.config import settings

# ── Connection Configuration ─────────────────────────────────────────────────
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)

class EmailService:
    @staticmethod
    async def send_otp_email(email_to: str, otp_code: str):
        """
        Sends an OTP verification email to the user.
        """
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 10px; border: 1px solid #ddd;">
                <h2 style="color: #333; text-align: center;">Verify Your Account 🧁</h2>
                <p style="color: #555; font-size: 16px;">Welcome to Whiffle Bakery! Use the code below to verify your email address:</p>
                <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #d32f2f;">{otp_code}</span>
                </div>
                <p style="color: #888; font-size: 12px; text-align: center;">This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.</p>
            </div>
        </body>
        </html>
        """

        message = MessageSchema(
            subject="Whiffle Bakery - Verify Your Email",
            recipients=[email_to],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)

    @staticmethod
    async def send_password_reset_email(email_to: str, otp_code: str):
        """
        Sends a password reset OTP email to the user.
        """
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 10px; border: 1px solid #ddd;">
                <h2 style="color: #333; text-align: center;">Reset Your Password 🧁</h2>
                <p style="color: #555; font-size: 16px;">We received a request to reset your Whiffle Bakery account password. Use the verification code below to reset it:</p>
                <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #d32f2f;">{otp_code}</span>
                </div>
                <p style="color: #888; font-size: 12px; text-align: center;">This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes. If you did not request this, you can safely ignore this email.</p>
            </div>
        </body>
        </html>
        """

        message = MessageSchema(
            subject="Whiffle Bakery - Reset Your Password",
            recipients=[email_to],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)

    @staticmethod
    async def send_order_confirmation(email_to: str, order_id: str, total_amount: float):
        """
        Sends an order confirmation email to the user.
        """
        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 10px; border: 1px solid #ddd;">
                <h2 style="color: #4CAF50; text-align: center;">Order Confirmed! 🧁</h2>
                <p style="color: #555; font-size: 16px;">Thank you for your order! We've received it and are preparing your bakery treats.</p>
                <div style="border-top: 2px solid #eee; margin: 20px 0; padding-top: 20px;">
                    <p><strong>Order ID:</strong> {order_id}</p>
                    <p><strong>Total Amount:</strong> ${total_amount:,.2f}</p>
                </div>
                <p style="color: #888; font-size: 14px; text-align: center;">You can view your order status in your profile.</p>
            </div>
        </body>
        </html>
        """

        message = MessageSchema(
            subject=f"Whiffle Bakery - Order #{order_id[:8]} confirmed!",
            recipients=[email_to],
            body=html,
            subtype=MessageType.html
        )

        fm = FastMail(conf)
        await fm.send_message(message)

    @staticmethod
    async def send_contact_email(name: str, email_from: str, subject: str, message_body: str):
        """
        Sends a contact form message to wajihacreates@gmail.com
        """
        html = f"""
        <html>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F8F5F2; padding: 40px 20px; margin: 0;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                <div style="background-color: #5C3A21; padding: 40px 30px; text-align: center;">
                    <h1 style="color: #F8F5F2; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px;">New Message ✨</h1>
                    <p style="color: rgba(248, 245, 242, 0.7); margin-top: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">from your bakery</p>
                </div>
                <div style="padding: 40px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                        <tr>
                            <td style="padding-bottom: 15px;">
                                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #A08C82; margin-bottom: 5px;">Sender</span>
                                <span style="display: block; font-size: 16px; color: #3A2618; font-weight: bold;">{name} <span style="color: #A08C82; font-weight: normal;">({email_from})</span></span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 15px; border-bottom: 1px solid #F0EAE5;">
                                <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #A08C82; margin-bottom: 5px;">Subject</span>
                                <span style="display: block; font-size: 18px; color: #D15B35; font-weight: bold;">{subject}</span>
                            </td>
                        </tr>
                    </table>
                    
                    <div style="background-color: #FDFBFA; border: 1px solid #F0EAE5; border-radius: 16px; padding: 30px;">
                        <span style="display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #A08C82; margin-bottom: 15px;">Message</span>
                        <p style="white-space: pre-wrap; color: #4A3B32; font-size: 16px; line-height: 1.8; margin: 0;">{message_body}</p>
                    </div>
                </div>
                <div style="background-color: #F8F5F2; padding: 20px; text-align: center; border-top: 1px solid #F0EAE5;">
                    <p style="color: #A08C82; font-size: 12px; margin: 0;">You can reply directly to this email to respond to {name}.</p>
                </div>
            </div>
        </body>
        </html>
        """

        message = MessageSchema(
            subject=f"New Bakery Contact: {subject}",
            recipients=["wajihacreates@gmail.com"],
            body=html,
            subtype=MessageType.html,
            reply_to=[email_from]
        )

        fm = FastMail(conf)
        await fm.send_message(message)
