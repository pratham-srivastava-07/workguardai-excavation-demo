import { BackgroundPattern } from "../sections/background-pattern"
import { CallToAction } from "../sections/call-to-actions"
import { CategoryTags } from "../sections/catagory-tags"
import { ContentGrid } from "../sections/content-grid"
import { HeroSection } from "../sections/hero"
import { Navigation } from "../layout/navigation"


const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <BackgroundPattern />
      <Navigation />

      <main className="relative z-10 px-6 md:px-12 pt-12">
        <HeroSection />
        <CategoryTags />
        <ContentGrid />
        <CallToAction />
      </main>
    </div>
  )
}

export default LandingPage
