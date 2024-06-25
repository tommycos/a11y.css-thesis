# Advancing Web Accessibility Knowledge by Utilizing a11y.css as an Educational Resource for Programmers
This is the code for a browser extension modified for the bachelor thesis with the title: Advancing Web Accessibility Knowledge by Utilizing a11y.css as an Educational Resource for Programmers, by Tomislav Cosic.

The original a11y.css-webextension:

[a11y.css](https://github.com/ffoodd/a11y.css/) webextension repository — for both Chromium-based browsers and Firefox.

How to set-up:
- Clone or download the repository.
- Install node and npm.
- Navigate to the webextension folder using your commnad line.
- Run "npm install" and then "npm run build".
- Two new zip folders should now have appeared within the webextension folder.
- Set the language of your browser to english.

For Firefox users:
- Go to the about:debugging page.
- Click on “This Firefox” on the left.
- Click the “Load Temporary Add-on…” button under Temporary Extensions.
- Choose the zip folder ending with "-firefox" (should be a11ycss-webextension-2.0.1-firefox.zip).
- The extension should now show up within Firefox.

For Chrome users:
- Unzip the zip folder ending with "-chrome" (should be a11ycss-webextension-2.0.1-chrome.zip).
- Go to the chrome://extensions/ page.
- Activate Developer mode on the top right of the page.
- Click on the “Load unpacked” button on the top left of the page.
- Choose the unzipped folder.
- The extension should now show up.

You may test the webextension on any website or use this simple testpage: https://github.com/tommycos/test-webpage (requires installing http-server with npm to host)
