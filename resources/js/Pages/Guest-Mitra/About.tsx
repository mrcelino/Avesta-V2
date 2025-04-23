import { AboutSection } from "../Guest/About"
import GuestLayout from "@/Layouts/GuestLayout"

export default function About() {
  return (
    <GuestLayout showFooter={true}>
      <AboutSection />
    </GuestLayout>
  )
}
