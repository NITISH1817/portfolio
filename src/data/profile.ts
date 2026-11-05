import { identityData } from './portfolio';

export const profile = {
  name: identityData.name,
  shortName: identityData.shortName,
  headline: [
    "Computer Science & Engineering Student",
    "Software Engineer",
    "Java Developer",
    "AI/ML Engineer"
  ],
  role: identityData.role,
  location: identityData.location,
  phone: identityData.phone,
  email: identityData.email,
  github: identityData.github,
  linkedin: identityData.linkedin,
  leetcode: identityData.leetcode,
  resume: identityData.resumeUrl,
  contact: {
    email: identityData.email,
    phone: identityData.phone,
    linkedin: identityData.linkedin,
    github: identityData.github,
    leetcode: identityData.leetcode
  },
  education: {
    institution: "Bannari Amman Institute of Technology",
    degree: "B.E. Computer Science and Engineering",
    batch: "2024 – 2028 (Expected May 2028)",
    cgpa: "7.8"
  },
  school: {
    institution: "Saratha Matriculation Higher Secondary School",
    degree: "Higher Secondary Certificate (HSC)",
    period: "2023 – 2024",
    score: "93.1%"
  },
  credentials: [
    "Oracle Certified Associate: Java SE 17 Developer",
    "AWS Cloud Practitioner Essentials",
    "Introduction to Cybersecurity (Cisco)",
    "250+ LeetCode DSA Problems in Java",
    "Selected Participant, Smart India Hackathon (SIH 2025)",
    "Patent Filed: GovScheme AI Welfare Platform"
  ],
  about: identityData.aboutStory
};

export default profile;
