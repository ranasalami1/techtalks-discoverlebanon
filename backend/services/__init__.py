import smtplib
from email.message import EmailMessage

from flask import current_app


def send_password_reset_email(recipient, reset_url):
	host = current_app.config.get("SMTP_HOST")
	sender = current_app.config.get("SMTP_SENDER")
	if not host or not sender:
		raise RuntimeError("SMTP_HOST and SMTP_SENDER must be configured")

	message = EmailMessage()
	message["Subject"] = "Reset your Discover Lebanon password"
	message["From"] = sender
	message["To"] = recipient
	message.set_content(
		"We received a request to reset your password. "
		f"Use this link within one hour: {reset_url}\n\n"
		"If you did not request a reset, you can ignore this email."
	)

	with smtplib.SMTP(
		host,
		current_app.config.get("SMTP_PORT", 587),
		timeout=10,
	) as smtp:
		if current_app.config.get("SMTP_USE_TLS", True):
			smtp.starttls()
		username = current_app.config.get("SMTP_USERNAME")
		password = current_app.config.get("SMTP_PASSWORD")
		if username and password:
			smtp.login(username, password)
		smtp.send_message(message)
