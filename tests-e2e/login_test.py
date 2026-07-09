from playwright.sync_api import sync_playwright, expect
import re


def test_login():

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False)

        page = browser.new_page()

        page.goto(
            "https://ezequiel-moran-tp-2-prog-4-2026-fro.vercel.app"
        )

        page.fill(
            "#usuario",
            "Palandri01"
        )

        page.fill(
            'input[formControlName="password"]',
            "Palandri01"
        )

        page.click(
            "button.btn-primary"
        )

        expect(page).to_have_url(
            re.compile(".*publicaciones.*")
        )

        page.wait_for_timeout(5000)

        browser.close()


test_login()