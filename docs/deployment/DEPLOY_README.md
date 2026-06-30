# GitHub Pages Deployment — Proxuma IT v3.44.0

This folder is prepared as a clean GitHub Pages repository root.

## Upload

1. Open the Proxuma IT GitHub repository.
2. Upload **the contents of this folder** to the repository root.
3. Confirm that `index.html` is visible at the root, not inside another folder.
4. Commit the files.
5. Open **Settings → Pages**.
6. Set the source to **Deploy from a branch**.
7. Select the publishing branch, normally `main`, and folder `/ (root)`.
8. Save and wait for GitHub Pages to publish.

## Important

Do not upload the outer folder itself as an extra nested level. The repository root should directly contain `index.html`, `styles.css`, the JavaScript files, `.nojekyll`, and the documentation files.

## Post-deployment check

- Load the public URL in a private browser window.
- Test on desktop and phone.
- Hard-refresh once after deployment.
- Confirm that all selector, disclosure, scan, case-file, workflow, and export controls behave as expected.
