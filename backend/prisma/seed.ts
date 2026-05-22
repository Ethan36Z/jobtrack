import { ApplicationStatus, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function addDays(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

async function upsertResumeVersion(data: {
  name: string;
  targetRole: string;
  fileUrl: string;
  notes: string;
}) {
  const existing = await prisma.resumeVersion.findFirst({
    where: { name: data.name }
  });

  if (existing) {
    return prisma.resumeVersion.update({
      where: { id: existing.id },
      data
    });
  }

  return prisma.resumeVersion.create({ data });
}

async function upsertDemoApplication(data: {
  companyName: string;
  jobTitle: string;
  jobUrl?: string;
  location?: string;
  status: ApplicationStatus;
  source?: string;
  appliedDate?: Date;
  nextAction?: string;
  followUpDate?: Date;
  resumeVersionId?: number;
  notes?: string;
}) {
  const existing = await prisma.application.findFirst({
    where: {
      companyName: data.companyName,
      jobTitle: data.jobTitle
    }
  });

  if (existing) {
    await prisma.interviewNote.deleteMany({ where: { applicationId: existing.id } });
    await prisma.companyResearch.deleteMany({ where: { applicationId: existing.id } });

    return prisma.application.update({
      where: { id: existing.id },
      data
    });
  }

  return prisma.application.create({ data });
}

async function main() {
  console.log("Seeding JobTrack demo data...");

  const backendResume = await upsertResumeVersion({
    name: "Backend Engineer Resume",
    targetRole: "Backend Engineer",
    fileUrl: "https://example.com/resumes/backend-engineer.pdf",
    notes: "Emphasizes Node.js, TypeScript, APIs, databases, and production ownership."
  });

  const fullStackResume = await upsertResumeVersion({
    name: "Full-Stack Product Resume",
    targetRole: "Full-Stack Engineer",
    fileUrl: "https://example.com/resumes/full-stack-product.pdf",
    notes: "Highlights React, UX judgment, API design, and product-oriented delivery."
  });

  const applications = await Promise.all([
    upsertDemoApplication({
      companyName: "Northstar Labs",
      jobTitle: "Backend Engineer",
      jobUrl: "https://example.com/jobs/northstar-backend",
      location: "Remote",
      status: ApplicationStatus.INTERVIEWING,
      source: "LinkedIn",
      appliedDate: addDays(-14),
      nextAction: "Prep system design examples before the technical screen",
      followUpDate: addDays(1),
      resumeVersionId: backendResume.id,
      notes: "Strong fit for API platform work. Team values ownership and clear communication."
    }),
    upsertDemoApplication({
      companyName: "BrightPath Health",
      jobTitle: "Full-Stack Engineer",
      jobUrl: "https://example.com/jobs/brightpath-fullstack",
      location: "San Francisco, CA",
      status: ApplicationStatus.APPLIED,
      source: "Company careers page",
      appliedDate: addDays(-5),
      nextAction: "Follow up with recruiter",
      followUpDate: addDays(0),
      resumeVersionId: fullStackResume.id,
      notes: "Healthcare workflow product with a practical full-stack role."
    }),
    upsertDemoApplication({
      companyName: "Atlas Robotics",
      jobTitle: "Platform Engineer",
      jobUrl: "https://example.com/jobs/atlas-platform",
      location: "Austin, TX",
      status: ApplicationStatus.SAVED,
      source: "Referral",
      nextAction: "Ask referrer about team interview loop",
      followUpDate: addDays(5),
      resumeVersionId: backendResume.id,
      notes: "Interesting infrastructure role. Need to tailor resume before applying."
    }),
    upsertDemoApplication({
      companyName: "Harbor Analytics",
      jobTitle: "Frontend Engineer",
      jobUrl: "https://example.com/jobs/harbor-frontend",
      location: "New York, NY",
      status: ApplicationStatus.OFFER,
      source: "Recruiter outreach",
      appliedDate: addDays(-30),
      nextAction: "Review offer details and compare compensation",
      followUpDate: addDays(2),
      notes: "Offer received. Need to evaluate growth path and team fit."
    }),
    upsertDemoApplication({
      companyName: "Lumen Cloud",
      jobTitle: "Software Engineer",
      jobUrl: "https://example.com/jobs/lumen-software",
      location: "Seattle, WA",
      status: ApplicationStatus.REJECTED,
      source: "Indeed",
      appliedDate: addDays(-21),
      followUpDate: addDays(-2),
      notes: "Rejected after phone screen. Useful practice for behavioral answers."
    })
  ]);

  const [northstar, brightPath] = applications;

  await prisma.interviewNote.createMany({
    data: [
      {
        applicationId: northstar.id,
        roundName: "Recruiter Screen",
        interviewDate: addDays(-7),
        interviewer: "Maya, Technical Recruiter",
        format: "Video",
        summary: "Covered backend experience, API ownership, and team expectations.",
        questions: "Why this company? Describe a production incident you owned.",
        nextSteps: "Technical screen with engineering manager.",
        result: "Moved forward"
      },
      {
        applicationId: brightPath.id,
        roundName: "Hiring Manager Chat",
        interviewDate: addDays(-2),
        interviewer: "Jordan, Engineering Manager",
        format: "Phone",
        summary: "Discussed product-minded engineering and working with design.",
        questions: "How do you balance quality and speed? What makes a good dashboard?",
        nextSteps: "Wait for scheduling update.",
        result: "Pending"
      }
    ]
  });

  await prisma.companyResearch.createMany({
    data: [
      {
        applicationId: northstar.id,
        companyWebsite: "https://example.com/northstar",
        companySize: "120 employees",
        industry: "Developer tools",
        location: "Remote-first",
        mission: "Help engineering teams ship reliable internal platforms.",
        products: "API observability and service catalog tools.",
        techStack: "Node.js, TypeScript, PostgreSQL, Kubernetes.",
        cultureNotes: "Strong written communication and ownership culture.",
        interviewTips: "Prepare examples around incident response and system design tradeoffs.",
        redFlags: "Fast-growing team may have shifting priorities.",
        whyInterested: "The role aligns with backend platform experience and product-minded tooling."
      },
      {
        applicationId: brightPath.id,
        companyWebsite: "https://example.com/brightpath",
        companySize: "350 employees",
        industry: "Healthcare technology",
        location: "San Francisco, CA",
        mission: "Simplify patient operations for small clinics.",
        products: "Scheduling, intake, and care coordination workflow software.",
        techStack: "React, Express, MySQL, AWS.",
        cultureNotes: "Mission-driven and cross-functional.",
        interviewTips: "Connect technical choices to user workflow impact.",
        redFlags: "Healthcare compliance may slow delivery.",
        whyInterested: "Good match for full-stack product engineering."
      }
    ]
  });

  console.log(`Seeded ${applications.length} applications, 2 resume versions, 2 interview notes, and 2 company research records.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
