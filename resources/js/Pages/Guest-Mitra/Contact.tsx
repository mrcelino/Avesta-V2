import { ContactSection } from "../Guest/Contact"
import GuestLayout from "@/Layouts/GuestLayout"
function Contact() {
  return (
    <GuestLayout showFooter={true}>
      <ContactSection />
    </GuestLayout>
  )
}

export default Contact