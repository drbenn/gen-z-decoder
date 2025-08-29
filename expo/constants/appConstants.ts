const appleStoreId = "NEED!"
const googlePlayStorePackageName = "NEED!"

const APP_CONSTANTS = {
  // Overview
  APP_NAME: 'Gen-Z Translator: No Cap',
  APP_TAGLINE: 'IDK WHATEVER',
  VERSION_NO: '1.0',

  /**
   * 
   *        WARNING!!    WARNING!!!   WARNING!!   WARNING!!!
   * 
   *    KEEP FALSE DURING BUILD FOR EXPO TESTING -   If you click an
   *    ad while testing the build on physical phone admob will fuck you
   *    over thinking i am trying to game ads and ban you.
   */
  ADS_TESTING_PHASE: true, // Set to FALSE !!only!! when submitting to App Store - 
  DEBUG_TOOLS_ACTIVE: false,

  // API Access
  LOCAL_API_IOS: 'http://localhost:3000/v1',
  LOCAL_API_ANDROID: 'http://10.0.2.2:3000/v1',
  PRODUCTION_WEB_API: 'https://genz.sparkdart.com/v1',
  
  // Developer
  DEVELOPER_CO: 'SparkDart',
  DEVELOPER_EMAIL: 'sparkdart.contact@gmail.com',
  DEVELOPER_WEBSITE: 'https://sparkdart.com',
  APP_WEBSITE: 'https://sparkdart.com/apps/gen-z-translator',
  APP_WEBSITE_APP_PRIVACY_POLICY: 'https://sparkdart.com/apps/gen-z-translator/privacy-policy',
  APP_WEBSITE_APP_TERMS_OF_SERVICE: 'https://sparkdart.com/apps/gen-z-translator/terms-of-service',

  // App store
  APPLE_APP_STORE_REVIEW_LINK: `https://apps.apple.com/app/id${appleStoreId}?action=write-review`,
  ANDROID_APP_STORE_REVIEW_LINK: `https://play.google.com/store/apps/details?id=${googlePlayStorePackageName}&showAllReviews=true`,

}

export default APP_CONSTANTS