import { About } from "@/components/about";
import { Contact } from "@/components/contact/contact";
import { Education } from "@/components/education";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero/hero";
import { ProjectsSection } from "@/components/projects/projects-section";
import { profile, siteUrl } from "@/lib/data";
import { getProjects, getSkills } from "@/lib/queries";

/** schema.org Person markup so search engines can build a rich result. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  jobTitle: profile.headline,
  address: { "@type": "PostalAddress", addressLocality: "Ranchi", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Birla Institute of Technology, Mesra" },
  sameAs: [profile.githubUrl, profile.linkedinUrl],
};

export default async function HomePage() {
  const [projects, skills] = await Promise.all([getProjects(), getSkills()]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <About skills={skills} />
      <Experience />
      <ProjectsSection projects={projects} />
      <Education />
      <Contact />
    </>
  );
}
