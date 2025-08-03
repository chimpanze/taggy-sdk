# Publishing Guide for Taggy SDK

This document explains how the Taggy SDK is automatically published to GitHub Packages using semantic versioning and GitHub Actions.

## Automated Publishing Process

The Taggy SDK uses semantic versioning and automated publishing through GitHub Actions. The process works as follows:

1. When a pull request is merged to the `main` branch, the GitHub Actions workflow automatically:
   - Builds the package
   - Runs tests
   - Determines the next version number based on commit messages
   - Updates the version in package.json
   - Creates a new GitHub release with release notes
   - Publishes the package to GitHub Packages
   - Updates the documentation on GitHub Pages

## Semantic Versioning

The version number is automatically determined based on the commit messages in the pull request using semantic-release:

- `fix:` commits trigger a PATCH version increment (e.g., 1.0.0 → 1.0.1)
- `feat:` commits trigger a MINOR version increment (e.g., 1.0.0 → 1.1.0)
- `BREAKING CHANGE:` in the commit body or `feat!:` in the commit header triggers a MAJOR version increment (e.g., 1.0.0 → 2.0.0)

### Commit Message Format

To ensure proper versioning, follow the [Conventional Commits](https://www.conventionalcommits.org/) format for your commit messages:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Examples:
- `fix: correct network timeout handling`
- `feat: add support for custom headers`
- `feat!: remove deprecated API methods`
- `chore: update dependencies`

## Authentication for GitHub Packages

The GitHub Actions workflow automatically uses the `GITHUB_TOKEN` that is provided by GitHub Actions for authentication. This token is used in two ways:

1. As `GITHUB_TOKEN` for GitHub API operations (creating releases, etc.)
2. As `NPM_TOKEN` for semantic-release to authenticate with the npm registry
3. As `NODE_AUTH_TOKEN` for the npm publish command

No additional setup is required for authentication in the CI environment.

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

## Troubleshooting

If the publication fails, check the GitHub Actions logs for errors. Common issues include:

- **Authentication failure**: Check that the workflow has access to the `GITHUB_TOKEN` (this should be automatic)
- **Missing NPM_TOKEN**: If semantic-release fails with "No npm token specified", ensure that the NPM_TOKEN environment variable is set in the semantic-release step of the workflow
- **Version conflict**: This should not happen with semantic-release, but if it does, check if the version was manually modified
- **Build failure**: Make sure all tests pass and the build completes successfully
- **Package.json issues**: Verify that package.json is valid and contains all required fields, including the correct scope (@chimpanze)
- **Commit message format**: Ensure your commit messages follow the Conventional Commits format for proper versioning

## Verifying a Publication

After a pull request is merged:

1. Check the GitHub Actions workflow run to ensure it completed successfully
2. Verify the new version number in package.json
3. Check the GitHub Releases page for the new release and release notes
4. Check the package on GitHub by navigating to your repository, clicking on "Packages" in the right sidebar, and selecting the package
5. Verify that the documentation has been updated on GitHub Pages

## Manual Publication (Emergency Only)

In rare cases where the automated process fails and immediate publication is required:

1. Ensure you are authenticated with GitHub Packages:
   ```bash
   npm login --scope=@chimpanze --registry=https://npm.pkg.github.com
   ```
   Use your GitHub username, personal access token as password, and GitHub email.

2. Update the version in package.json manually following semantic versioning principles.

3. Build the package:
   ```bash
   npm run build
   ```

4. Publish to GitHub Packages:
   ```bash
   npm publish
   ```

5. Create a GitHub release manually.

Note that manual publication should be used only in emergency situations. The automated GitHub Actions workflow is the standard method for publishing new versions.