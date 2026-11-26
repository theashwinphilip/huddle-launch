# huddle. — Product launch website

A responsive, dark-mode, purple-led one-page launch site for **huddle.** Built with plain HTML, CSS and JavaScript. It uses the supplied visual references, cropped into local WebP assets.

## Preview locally

1. Unzip the project.
2. Open `index.html` in a modern browser.
3. For a local development server, run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

No build step, framework or API key is required. Google Fonts are loaded from Google Fonts; the page falls back to system fonts if unavailable.

## Deploy with GitHub Pages

1. Create a new GitHub repository (for example, `huddle-launch`).
2. Upload the contents of this folder to the repository root: `index.html`, `styles.css`, `script.js`, `README.md` and `assets/`.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. GitHub will provide the public URL after deployment.

You can also drag the folder into Netlify Drop or import the GitHub repository into Vercel. A static host is sufficient for this launch page.

## Before launch

- Connect a domain name and update the title/description if needed.
- Add a real mailing-list provider (for example, a form endpoint or CRM) if you want early-access emails collected automatically.
- The current early-access form opens the visitor's email app and drafts a message to `ashwinphilip.work@gmail.com`; it does not store addresses on a server.
- Confirm founder spelling, email address, launch platform and any app-store links before publishing.

## Editing

- Main content: `index.html`
- Visual design and responsive layouts: `styles.css`
- Mobile menu, reveal effects, carousel and early-access email action: `script.js`
- Supplied/cropped images: `assets/`
