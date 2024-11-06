import os
import re
import threading

from django.conf import settings
from django.core.mail import send_mail
from django.utils.html import strip_tags


class EmailThread(threading.Thread):
    def __init__(
        self,
        subject: str,
        html_content: str | None,
        plain_text_content: str,
        recipient_list: list[str],
        sender: str | None = None,
    ):
        super().__init__()
        self.subject = subject
        self.recipient_list = recipient_list
        self.plain_text_content = plain_text_content
        self.html_content = html_content
        self.sender = sender

    def run(self):
        try:
            send_mail(
                subject=self.subject,
                html_message=self.html_content,
                from_email=self.sender,
                recipient_list=self.recipient_list,
                message=self.plain_text_content,
            )
        except Exception as err:
            print(err)


def send_html_mail(
    subject: str,
    html_content: str | None,
    plain_text_content: str,
    recipient_list: list[str],
    sender: str | None = None,
):
    if settings.EMAIL_NOTIFICATIONS is False:
        return

    if sender is None:
        sender = os.getenv("EMAIL_HOST_USER", None)

    EmailThread(
        subject, html_content, plain_text_content, recipient_list, sender
    ).start()


class HtmlMail:
    @staticmethod
    def textify_html(html: str):
        html = re.sub("[ \t]+", " ", strip_tags(html))
        html = html.replace("\n ", "\n").strip()
        html = re.sub(r"\n{3,}", "\n\n", html)
        return html
