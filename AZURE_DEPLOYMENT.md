# Azure Static Web Apps Deployment Guide

This guide provides comprehensive information about deploying the Real-Time Community Open Chat application to Azure Static Web Apps.

## Table of Contents

- [What is Azure Static Web Apps?](#what-is-azure-static-web-apps)
- [Why Azure Static Web Apps?](#why-azure-static-web-apps)
- [Prerequisites](#prerequisites)
- [Quick Start Deployment](#quick-start-deployment)
- [Configuration Files](#configuration-files)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Environment Variables](#environment-variables)
- [Custom Domain Setup](#custom-domain-setup)
- [Security Best Practices](#security-best-practices)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Troubleshooting](#troubleshooting)
- [Cost Information](#cost-information)

## What is Azure Static Web Apps?

Azure Static Web Apps is a service that automatically builds and deploys full stack web apps to Azure from a code repository. It provides:

- **Global Distribution**: Content is distributed globally for fast access
- **Free SSL Certificates**: Automatic HTTPS for security
- **Custom Domains**: Support for your own domain names
- **Integrated CI/CD**: Automatic deployments from GitHub
- **Staging Environments**: Preview deployments for pull requests
- **Serverless APIs**: Optional Azure Functions integration
- **Built-in Authentication**: Social login providers (optional)

## Why Azure Static Web Apps?

For this real-time chat application, Azure Static Web Apps offers several advantages:

1. **Zero Configuration Deployment**: Works out of the box with minimal setup
2. **Free Tier Available**: Perfect for development and small projects
3. **Global CDN**: Fast loading times worldwide
4. **GitHub Integration**: Automatic deployments on every push
5. **Preview Environments**: Test PRs before merging
6. **No Server Management**: Fully managed infrastructure
7. **Scalability**: Automatically handles traffic spikes

## Prerequisites

Before deploying, ensure you have:

- ✅ An [Azure account](https://azure.microsoft.com/free/) (free tier available)
- ✅ A [GitHub account](https://github.com)
- ✅ The repository forked or available in your GitHub account
- ✅ A Firebase project set up (for the chat backend)

## Quick Start Deployment

### Option 1: Deploy via Azure Portal (Recommended for Beginners)

1. **Sign in to Azure Portal**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Sign in with your Microsoft account

2. **Create Static Web App Resource**
   ```
   Click "Create a resource" 
   → Search "Static Web App" 
   → Click "Create"
   ```

3. **Configure Basic Settings**
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new (e.g., `rg-community-chat`)
   - **Name**: Enter unique name (e.g., `community-chat-app-001`)
   - **Plan Type**: Select "Free" for development
   - **Region**: Choose closest to your users (e.g., `East US 2`)

4. **Configure GitHub Integration**
   - **Source**: GitHub
   - **GitHub Account**: Authorize Azure to access GitHub
   - **Organization**: Your GitHub username/organization
   - **Repository**: `real-time-community-open-chat`
   - **Branch**: `main`

5. **Configure Build Settings**
   - **Build Presets**: Custom
   - **App location**: `/`
   - **Api location**: (leave empty)
   - **Output location**: (leave empty)

6. **Review and Create**
   - Click "Review + create"
   - Review settings
   - Click "Create"

7. **Wait for Deployment**
   - Deployment typically takes 2-3 minutes
   - Azure creates GitHub secret automatically
   - First deployment triggers automatically

8. **Access Your App**
   - Click "Go to resource"
   - Copy the URL from the overview page
   - Open in browser to test

### Option 2: Deploy via Azure CLI

```bash
# Install Azure CLI if not already installed
# https://docs.microsoft.com/cli/azure/install-azure-cli

# Login to Azure
az login

# Create resource group
az group create \
  --name rg-community-chat \
  --location eastus2

# Create static web app
az staticwebapp create \
  --name community-chat-app \
  --resource-group rg-community-chat \
  --source https://github.com/YOUR_USERNAME/real-time-community-open-chat \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --login-with-github
```

### Option 3: Deploy via VS Code Extension

1. Install [Azure Static Web Apps Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)
2. Open project in VS Code
3. Click Azure icon in sidebar
4. Click "+" to create new Static Web App
5. Follow the prompts

## Configuration Files

### staticwebapp.config.json

Located in the root directory, this file controls various aspects of your Azure Static Web App:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/style.css", "/main.js"]
  },
  "routes": [
    {
      "route": "/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "mimeTypes": {
    ".json": "application/json",
    ".js": "text/javascript",
    ".css": "text/css",
    ".html": "text/html"
  },
  "globalHeaders": {
    "cache-control": "public, max-age=3600"
  }
}
```

**Key Configuration Options:**

- **navigationFallback**: Ensures SPA routing works correctly
- **routes**: Defines access control for different paths
- **responseOverrides**: Custom error pages
- **mimeTypes**: Ensures correct content types
- **globalHeaders**: Sets HTTP headers for all responses

**Advanced Configuration Options:**

```json
{
  "networking": {
    "allowedIpRanges": ["10.0.0.0/24"]
  },
  "auth": {
    "identityProviders": {
      "github": {
        "registration": {
          "clientIdSettingName": "GITHUB_CLIENT_ID",
          "clientSecretSettingName": "GITHUB_CLIENT_SECRET"
        }
      }
    }
  }
}
```

See [Azure Static Web Apps configuration](https://docs.microsoft.com/azure/static-web-apps/configuration) for all options.

## CI/CD with GitHub Actions

The `.github/workflows/azure-static-web-apps.yml` file enables automatic deployments:

### Workflow Features

- ✅ **Automatic Deployment**: Triggers on push to main branch
- ✅ **Pull Request Previews**: Creates staging environments for PRs
- ✅ **Automated Cleanup**: Removes staging environments when PRs close
- ✅ **Build Optimization**: Skips unnecessary build steps for static apps

### Workflow File Breakdown

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [main]
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [main]
```
- Triggers on main branch pushes and PR events

```yaml
jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          skip_app_build: true
```
- Checks out code and deploys to Azure
- `skip_app_build: true` because no build step needed

### Manual Deployment

To manually trigger a deployment:

```bash
# Make a change and commit
git add .
git commit -m "Update app"
git push origin main

# Or trigger workflow manually via GitHub UI
# Go to Actions → Azure Static Web Apps CI/CD → Run workflow
```

## Environment Variables

This application uses Firebase for real-time data. The Firebase configuration is currently hardcoded in `main.js`.

### Current Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB9UXuwY4xPIYE_Cj-MWQ2c6HCrQdSzhjE",
  authDomain: "real-time-community-chat.firebaseapp.com",
  projectId: "real-time-community-chat",
  // ...
};
```

### Best Practice: Use Environment Variables (Optional Enhancement)

For better security, you could move configuration to environment variables:

1. **Update main.js to read from window object**:
```javascript
const firebaseConfig = {
  apiKey: window.FIREBASE_API_KEY,
  authDomain: window.FIREBASE_AUTH_DOMAIN,
  projectId: window.FIREBASE_PROJECT_ID,
  // ...
};
```

2. **Set in Azure Static Web Apps**:
```bash
az staticwebapp appsettings set \
  --name community-chat-app \
  --setting-names FIREBASE_API_KEY=your-api-key
```

However, note that client-side code always exposes API keys, so proper Firebase security rules are more important.

## Custom Domain Setup

### Add Custom Domain

1. **Go to Azure Portal**
   - Navigate to your Static Web App
   - Click "Custom domains" in left menu

2. **Add Custom Domain**
   - Click "+ Add"
   - Enter your domain (e.g., `chat.yourdomain.com`)
   - Choose validation method:
     - **CNAME**: For subdomains (recommended)
     - **TXT**: For apex domains

3. **Configure DNS (CNAME Example)**
   - In your DNS provider, add CNAME record:
   ```
   Type: CNAME
   Name: chat (or @)
   Value: [your-app-name].azurestaticapps.net
   TTL: 3600
   ```

4. **Verify Domain**
   - Azure validates DNS records automatically
   - SSL certificate is provisioned automatically
   - Usually takes 5-10 minutes

### Multiple Domains

You can add multiple custom domains (2 on free tier, unlimited on standard):

```bash
az staticwebapp hostname set \
  --name community-chat-app \
  --hostname chat.yourdomain.com

az staticwebapp hostname set \
  --name community-chat-app \
  --hostname www.chat.yourdomain.com
```

## Security Best Practices

### 1. Firebase Security Rules

Configure Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all messages
    match /messages/{message} {
      allow read: if true;
      
      // Allow write only to authenticated users or with rate limiting
      allow write: if request.time > resource.data.lastWrite + duration.value(1, 's');
    }
  }
}
```

### 2. API Key Restrictions

Restrict Firebase API key to your domain:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to "APIs & Services" → "Credentials"
4. Click on your API key
5. Under "Application restrictions":
   - Select "HTTP referrers"
   - Add: `*.azurestaticapps.net/*`
   - Add your custom domain if applicable

### 3. Content Security Policy

Add CSP headers in `staticwebapp.config.json`:

```json
{
  "globalHeaders": {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com"
  }
}
```

### 4. HTTPS Enforcement

Azure Static Web Apps automatically enforces HTTPS. All HTTP requests are redirected to HTTPS.

## Monitoring and Analytics

### Azure Application Insights

1. **Enable Application Insights**:
   - In Azure Portal, go to your Static Web App
   - Click "Application Insights" in left menu
   - Click "Turn on Application Insights"

2. **View Metrics**:
   - Page views
   - User sessions
   - Performance metrics
   - Exceptions and errors

### GitHub Actions Logs

Monitor deployments:
1. Go to your GitHub repository
2. Click "Actions" tab
3. View workflow runs and logs

### Azure Monitor

Set up alerts:
```bash
az monitor metrics alert create \
  --name high-response-time \
  --resource-group rg-community-chat \
  --scopes /subscriptions/.../staticSites/community-chat-app \
  --condition "avg ResponseTime > 1000" \
  --description "Alert when response time exceeds 1 second"
```

## Troubleshooting

### Common Issues and Solutions

#### Issue: Deployment Failed

**Symptoms**: GitHub Actions workflow fails

**Solutions**:
1. Check GitHub Actions logs for error details
2. Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` secret exists
3. Ensure workflow file syntax is correct
4. Check Azure Portal for deployment status

```bash
# Re-get deployment token
az staticwebapp secrets list \
  --name community-chat-app \
  --resource-group rg-community-chat
```

#### Issue: 404 on Page Refresh

**Symptoms**: Direct URL navigation returns 404

**Solutions**:
1. Ensure `staticwebapp.config.json` exists in root
2. Verify `navigationFallback` is configured:
```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

#### Issue: Firebase Connection Fails

**Symptoms**: Chat messages don't load/send

**Solutions**:
1. Check browser console for errors
2. Verify Firebase configuration in `main.js`
3. Check Firebase security rules
4. Ensure Firestore is enabled in Firebase Console
5. Verify API key restrictions allow Azure domain

#### Issue: CSS/JS Not Loading

**Symptoms**: Unstyled page or JavaScript errors

**Solutions**:
1. Verify MIME types in `staticwebapp.config.json`
2. Check file paths in `index.html`
3. Clear browser cache
4. Check Azure CDN cache:
```bash
az cdn endpoint purge \
  --content-paths "/*" \
  --name your-endpoint \
  --resource-group rg-community-chat
```

#### Issue: Custom Domain Not Working

**Symptoms**: Domain doesn't resolve or shows error

**Solutions**:
1. Verify DNS records with:
```bash
nslookup chat.yourdomain.com
dig chat.yourdomain.com
```
2. Check domain validation in Azure Portal
3. Wait for DNS propagation (up to 48 hours)
4. Ensure CNAME points to correct Static Web App URL

### Getting Help

- **Azure Support**: [Azure Portal → Help + Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)
- **Documentation**: [Azure Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- **Community**: [Microsoft Q&A](https://docs.microsoft.com/answers/topics/azure-static-web-apps.html)
- **GitHub Issues**: Report issues in this repository

## Cost Information

### Free Tier

Azure Static Web Apps Free tier includes:

| Feature | Free Tier Limit |
|---------|----------------|
| Bandwidth | 100 GB/month |
| Custom Domains | 2 |
| SSL Certificates | Included (automatic) |
| Environments | 3 (1 production + 2 staging) |
| Storage | 0.5 GB |
| API Functions | Not included |
| Build Minutes | 500 minutes/month |

**Perfect for**:
- Development and testing
- Small community projects
- Personal portfolios
- Low-traffic applications

### Standard Tier

Standard tier pricing (pay-as-you-go):

| Feature | Standard Tier |
|---------|--------------|
| Base Price | $9/month |
| Bandwidth | 100 GB included, then $0.15/GB |
| Custom Domains | Unlimited |
| Environments | Unlimited staging |
| Storage | 0.5 GB included, then $0.08/GB |
| API Functions | Pay per execution |

**Perfect for**:
- Production applications
- High-traffic sites
- Enterprise projects
- Apps requiring many staging environments

### Cost Optimization Tips

1. **Use Free Tier for Development**: Keep dev/test on free tier
2. **Optimize Assets**: Compress images and minify JS/CSS
3. **Leverage CDN Caching**: Set appropriate cache headers
4. **Monitor Usage**: Set up alerts for bandwidth usage
5. **Clean Up Old Resources**: Remove unused Static Web Apps

### Estimate Your Costs

Use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs based on your expected traffic.

For this chat application on the free tier:
- Estimated users: 100-500/month
- Bandwidth usage: ~10-20 GB/month
- **Cost: $0/month** (well within free tier limits)

---

## Additional Resources

- 📘 [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- 🎥 [Video Tutorial: Deploy to Azure Static Web Apps](https://docs.microsoft.com/shows/azure-tips-and-tricks-static-web-apps/)
- 📝 [Configuration Reference](https://docs.microsoft.com/azure/static-web-apps/configuration)
- 🔧 [GitHub Actions for Azure](https://github.com/Azure/actions)
- 💬 [Community Forum](https://docs.microsoft.com/answers/topics/azure-static-web-apps.html)

---

**Need help?** Open an issue in this repository or contact Azure Support.
