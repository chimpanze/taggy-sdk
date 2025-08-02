# Publishing Guide for Taggy SDK

This document explains how to publish new versions of the Taggy SDK to GitHub Packages using the GitHub Actions workflow.

## Prerequisites

Before you can publish the package, you need to:

1. Have write access to the GitHub repository

## Authentication for GitHub Packages

The GitHub Actions workflow automatically uses the `GITHUB_TOKEN` that is provided by GitHub Actions, so no additional setup is required for authentication.

If you need to authenticate locally for testing, you can create a Personal Access Token (PAT) with the appropriate permissions:

1. Go to your GitHub account settings
2. Click on "Developer settings" > "Personal access tokens" > "Tokens (classic)"
3. Click "Generate new token"
4. Give it a descriptive name
5. Select the `read:packages`, `write:packages`, and `delete:packages` scopes
6. Click "Generate token"
7. Copy the token (you won't be able to see it again)
8. Configure npm to use this token:
   ```bash
   npm login --scope=@chimpanze --registry=https://npm.pkg.github.com
   ```
   When prompted, use your GitHub username, the token as the password, and your GitHub email.

## Publishing a New Version

To publish a new version of the package:

1. Update the version number in `package.json`:
   ```json
   {
     "name": "@chimpanze/taggy-sdk",
     "version": "1.0.1"
   }
   ```
   
   Update the version number as needed for your release.

2. Create and push your changes:
   ```bash
   git add package.json
   git commit -m "Bump version to 1.0.1"
   git push origin main
   ```

3. Create a new release on GitHub:
   - Go to your GitHub repository
   - Click on "Releases" on the right sidebar
   - Click "Create a new release"
   - Tag version: `v1.0.1` (must start with 'v' followed by the version number)
   - Release title: `v1.0.1`
   - Description: Add release notes describing the changes
   - Click "Publish release"

4. The GitHub Actions workflow will automatically:
   - Build the package
   - Run tests
   - Publish the package to GitHub Packages

5. Verify the publication:
   - Check the GitHub Actions workflow run to ensure it completed successfully
   - Check the package on GitHub by navigating to your repository, clicking on "Packages" in the right sidebar, and selecting the package

## Troubleshooting

If the publication fails, check the GitHub Actions logs for errors. Common issues include:

- **Authentication failure**: Check that the workflow has access to the `GITHUB_TOKEN` (this should be automatic)
- **Version conflict**: Ensure you're publishing a version that doesn't already exist on GitHub Packages
- **Build failure**: Make sure all tests pass and the build completes successfully
- **Package.json issues**: Verify that package.json is valid and contains all required fields, including the correct scope (@chimpanze)

## Manual Publication

If you need to publish manually:

1. Ensure you are authenticated with GitHub Packages:
   ```bash
   npm login --scope=@chimpanze --registry=https://npm.pkg.github.com
   ```
   Use your GitHub username, personal access token as password, and GitHub email.

2. Build the package:
   ```bash
   npm run build
   ```

3. Publish to GitHub Packages:
   ```bash
   npm publish
   ```

Note that manual publication should be a fallback option. The GitHub Actions workflow is the preferred method for publishing new versions.