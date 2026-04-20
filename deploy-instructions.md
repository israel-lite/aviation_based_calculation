# Deployment Instructions for Eazee TSD Calc

## Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `eazee-tsd-calc`
3. Description: `Eazee TSD Calc - Aviation Time Speed Distance Calculator`
4. Make it **Public**
5. **Don't** initialize with README (we already have files)
6. Click "Create repository"

## Step 2: Push to GitHub
After creating the repository, run these commands:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/eazee-tsd-calc.git

# Push to GitHub
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Via Vercel CLI
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Option B: Via Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository: `eazee-tsd-calc`
3. Framework Preset: **Other**
4. Build Command: Leave empty (static site)
5. Output Directory: Leave empty (root directory)
6. Click "Deploy"

## Step 4: Custom Domain (Optional)
After deployment, you can add a custom domain in Vercel dashboard.

## Files Created for Deployment:
- `vercel.json` - Vercel configuration
- `package.json` - Project metadata
- `.gitignore` - Git ignore rules

## Your App Will Be Available At:
- GitHub: https://github.com/YOUR_USERNAME/eazee-tsd-calc
- Vercel: https://eazee-tsd-calc.vercel.app (or custom domain)

## Features Ready for Production:
- Fully responsive design
- Modern aviation cockpit UI
- Gold branding with custom logo
- All TSD calculation features
- Quiz and challenge modes
- History tracking
- Unit conversions

**Your Eazee TSD Calc is ready for deployment! **
