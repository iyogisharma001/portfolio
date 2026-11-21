import { About } from "@/components/about";
import { Contact } from "@/components/contact/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero/hero";
import { ProjectsSection } from "@/components/projects/projects-section";
import { profile, siteUrl } from "@/lib/data";
import { getLiveStats } from "@/lib/github";
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
  sameAs: [profile.githubUrl, profile.linkedinUrl, profile.leetcodeUrl],
};

export default async function HomePage() {
  const [projects, skills, stats] = await Promise.all([getProjects(), getSkills(), getLiveStats()]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero stats={stats} />
      <ProjectsSection projects={projects} repoStats={stats.repos} />
      <Experience />
      <About skills={skills} />
      <Contact />
    </>
  );
}
