# ok.let's.go.

Platform the holds all OKLG products and services, powered by $MTGY.

## Deployment

OKLG's platform is deployed to AWS S3. Use the
following instructions to deploy after changes are made.

### macOS

1. Make sure AWS CLI is installed via [Homebrew](https://brew.sh/)
   - `brew install awscli`
2. After changes are made, build files to `dist` directory
   - `npm run build`
3. `aws s3 cp --recursive dist s3://app.oklg.io`
4. Clear cloudfront distribution cache
   - `aws cloudfront create-invalidation --distribution-id DISTRIBUTION_ID`
