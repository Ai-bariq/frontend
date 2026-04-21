import { createFileRoute } from '@tanstack/react-router'
import Header from '../components/Layout/Header'
import Hero from '../components/LandingSections/Hero'
import Features from '../components/LandingSections/Features'
import HowItWorks from '../components/LandingSections/HowItWorks'
import AdaptiveSectors from '#/components/LandingSections/Adaptive'
import Pricing from '../components/LandingSections/Pricing'
import FAQ from '../components/LandingSections/FAQ'
import Cta from '../components/LandingSections/Cta'
import Footer from '../components/Layout/Footer'
export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Bariq Ai' }],
  }),
  component: LandingPage,
})

function LandingPage() {
  return (
    <>
      <Header/>
      <Hero />
      <Features />
      <HowItWorks />
      <AdaptiveSectors />
      <Pricing />
      <FAQ />
      <Cta />
      <Footer/>
    </>
  )
}