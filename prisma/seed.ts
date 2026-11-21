import { PrismaClient } from "@prisma/client";
import { profile, projects, skills } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
  const userData = {
    name: profile.name,
    headline: profile.headline,
    bio: profile.bio.join("\n\n"),
    location: profile.location,
    githubUrl: profile.githubUrl,
    linkedinUrl: profile.linkedinUrl,
    resumeUrl: profile.resumeUrl,
    available: profile.available,
    availability: profile.availability,
  };

  const user = await prisma.user.upsert({
    where: { email: profile.email },
    update: userData,
    create: { email: profile.email, ...userData },
  });

  // Remove projects and skills that are no longer in lib/data.ts.
  await prisma.project.deleteMany({ where: { slug: { notIn: projects.map((p) => p.slug) } } });
  await prisma.skill.deleteMany({ where: { name: { notIn: skills.map((s) => s.name) } } });

  for (const project of projects) {
    const data = { ...project, userId: user.id };
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: data,
      create: data,
    });
  }

  for (const skill of skills) {
    const data = { ...skill, userId: user.id };
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: data,
      create: data,
    });
  }

  console.log(`Seeded 1 user, ${projects.length} projects, ${skills.length} skills.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
