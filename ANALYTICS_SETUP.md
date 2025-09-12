# Google Analytics 4 Setup Instructions

## Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com/)
2. Sign in with your Google account
3. Click "Start measuring"
4. Create a new account:
   - Account name: "MenGauge"
   - Data sharing settings: Choose as desired

## Step 2: Set Up Property

1. Property name: "MenGauge Website"
2. Reporting time zone: Select your timezone
3. Currency: Select your currency
4. Industry category: "Health & Fitness" or "Mobile Applications"
5. Business size: Select appropriate size

## Step 3: Set Up Data Stream

1. Choose "Web" platform
2. Website URL: `https://yourdomain.com` (your actual domain)
3. Stream name: "MenGauge Web"
4. Enhanced measurement: Enable all options

## Step 4: Get Your Measurement ID

1. After creating the data stream, you'll see a **Measurement ID** like `G-XXXXXXXXXX`
2. Copy this ID

## Step 5: Update Your Website

1. Open `js/analytics.js`
2. Replace `G-XXXXXXXXXX` with your actual Measurement ID:
   ```javascript
   const GA_MEASUREMENT_ID = 'G-YOUR-ACTUAL-ID';
   ```
3. Save the file and deploy to your website

## What's Being Tracked

### Automatic Tracking (Enhanced Measurement)
- Page views with language and referrer data
- Scroll tracking
- Outbound link clicks
- Site search
- Video engagement (if applicable)
- File downloads

### Custom Events Tracked
- **App Install Clicks**: Android & iOS button clicks
- **Carousel Interactions**: Swipes, button clicks, slide navigation
- **Social Media Clicks**: Twitter/X button clicks
- **Navigation**: Terms, Policy, Support page clicks
- **User Engagement**: Time spent on site
- **Coming Soon Clicks**: iOS "Coming Soon" button

### Data Collected
- **User Language**: Browser language preference
- **Traffic Sources**: Where users come from (Google, social media, direct, etc.)
- **Geographic Data**: Country, region, city (automatic)
- **Device Information**: Desktop vs mobile, browser, OS
- **User Behavior**: Pages visited, time on site, bounce rate

## Key Metrics to Monitor

### In Google Analytics Dashboard:
1. **Acquisition** → **Traffic acquisition**: See traffic sources
2. **Engagement** → **Events**: See custom events like install clicks
3. **Demographics** → **Demographics details**: See user languages and locations
4. **Tech** → **Tech details**: See device and browser info

### Custom Events to Watch:
- `app_install_click` - Android/iOS install attempts
- `carousel_interaction` - How users engage with screenshots
- `social_click` - Social media engagement
- `ios_coming_soon_click` - Interest in iOS version

## Testing Your Setup

1. Deploy your updated website
2. Visit your site in an incognito browser
3. Click install buttons, navigate carousel, click social links
4. Check Google Analytics **Realtime** report (may take a few minutes)
5. Look for your test events in **Events** section

## Advanced Configuration (Optional)

### Custom Dimensions
You can add custom dimensions in GA4 for:
- User's preferred app store
- Carousel engagement level
- Device type preferences

### Conversion Goals
Set up conversions for:
- Android install clicks
- iOS install clicks (when available)
- Social media follows
- Page engagement time > 2 minutes

## Privacy Compliance

The analytics setup:
- ✅ Respects user privacy
- ✅ Uses Google's cookieless tracking where possible  
- ✅ Complies with GDPR (no personal data collected)
- ✅ Anonymizes IP addresses automatically

## Troubleshooting

### If events aren't showing:
1. Check browser console for errors
2. Verify Measurement ID is correct
3. Ensure website is live (not local development)
4. Wait up to 24 hours for data to appear in reports

### Common Issues:
- **Ad blockers**: May block GA tracking
- **Browser privacy settings**: May prevent tracking
- **Local development**: GA4 only works on live websites

## Support

For Google Analytics support:
- [Google Analytics Help Center](https://support.google.com/analytics/)
- [GA4 Setup Guide](https://support.google.com/analytics/answer/9304153)

---

**Next Steps After Setup:**
1. Monitor install button performance
2. Analyze traffic sources to optimize marketing
3. Track user languages to prioritize localization
4. Use carousel interaction data to improve app screenshots