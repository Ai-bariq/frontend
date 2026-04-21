

import LostReviewsSection from './FeaturesSections/LostReviews'
import SmartRepliesSection from './FeaturesSections/SmartReplies'
import AnalyticsSection from './FeaturesSections/Analytics'
import SentimentSection from './FeaturesSections/Sentimen'
import CustomizationSection from './FeaturesSections/Customisation'

export default function Features() {
  return (
    <div id='features'>
      <LostReviewsSection />
      <SmartRepliesSection />
      <AnalyticsSection />
      <SentimentSection />
      <CustomizationSection />
    </div>
  )
}