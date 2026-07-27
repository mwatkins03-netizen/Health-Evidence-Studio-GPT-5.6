# Evidence Studio — GitHub Pages Upload

This folder contains the compiled static site. It is intentionally different from the editable React source package: the browser-ready JavaScript and CSS are already built and all asset links are relative.

## Publish

1. Create or open a GitHub repository.
2. Upload **the contents of this folder** to the root of the repository. `index.html` must be at the repository root, not inside another folder.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.

After GitHub finishes publishing, the site will be available at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

## Important

- Do not upload the outer ZIP file as a single repository file. Unzip it first.
- Do not rename or separate the `assets` folder.
- GitHub Pages is static hosting, so this version uses the included practice evidence rather than the optional PubMed serverless proxy.
- The editable source remains in the separate `evidence-studio-github-ready` package.
