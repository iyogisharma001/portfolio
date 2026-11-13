import { Briefcase } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Timeline } from "@/components/ui/timeline";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      eyebrow="Experience"
      title="Where I've worked."
      description="Shipping production fixes as an intern, and learning to explain hard ideas simply as a teacher."
    >
      <Timeline entries={experience} icon={<Briefcase className="size-4 sm:size-[1.1rem]" />} />
    </Section>
  );
}
