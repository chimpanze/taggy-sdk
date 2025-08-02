# Changes

## 2025-08-03: GitHub Pages Documentation Deployment

### Summary
Added GitHub Pages deployment for the documentation. The documentation is now automatically built and deployed to GitHub Pages whenever changes are pushed to the main branch or a new version is tagged.

### Changes Made
1. Modified the GitHub workflow file (`.github/workflows/publish.yml`) to:
   - Add global permissions for GitHub Pages deployment
   - Add concurrency settings to manage deployments
   - Add a new job called "docs" that:
     - Depends on the "build" job
     - Only runs on pushes to the main branch or when tags starting with 'v' are pushed
     - Sets up a GitHub Pages environment
     - Builds documentation with `npm run docs`
     - Deploys the documentation to GitHub Pages

2. Updated the README.md to:
   - Change the API documentation link to point to the GitHub Pages URL
   - Add information about how the documentation is automatically generated and deployed

### How to Access the Documentation
The documentation is now available at: https://chimpanze.github.io/taggy-sdk/

### Note for Repository Administrators
For this workflow to function properly, GitHub Pages must be enabled for the repository:
1. Go to the repository settings
2. Navigate to "Pages" in the sidebar
3. Under "Build and deployment", select "GitHub Actions" as the source