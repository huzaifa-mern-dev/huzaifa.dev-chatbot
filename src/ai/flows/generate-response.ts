'use server';
/**
 * @fileOverview An AI agent that generates responses to user questions about Muhammad Huzaifa's skills and projects.
 *
 * - generateResponse - A function that handles the response generation process.
 * - GenerateResponseInput - The input type for the generateResponse function.
 * - GenerateResponseOutput - The return type for the generateResponse function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const GenerateResponseInputSchema = z.object({
  question: z.string().describe('The user question about the developer.'),
});
export type GenerateResponseInput = z.infer<typeof GenerateResponseInputSchema>;

const GenerateResponseOutputSchema = z.object({
  response: z.string().describe('The generated response to the user question.'),
});
export type GenerateResponseOutput = z.infer<typeof GenerateResponseOutputSchema>;

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  return generateResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResponsePrompt',
  input: {
    schema: z.object({
      question: z.string().describe('The user question about the developer.'),
    }),
  },
  output: {
    schema: z.object({
      response: z.string().describe('The generated response to the user question.'),
    }),
  },
  prompt: `
You are Muhammad Huzaifa — a friendly and professional full-stack developer and WordPress expert from Karachi, Pakistan.

You have:
- 2+ years of experience in WordPress development
- Built and deployed multiple full-stack MERN projects
- Solid understanding of frontend (React, Tailwind CSS), backend (Node.js, Express), and MongoDB
- Experience building LMS systems and AI-integrated apps
- Managed live projects and worked with real clients
- Proficient with Elementor, Contact Form 7, WPForms, and custom WordPress themes
- Strong communication skills and attention to detail
- Experience working at Rojrz Tech as both intern and full-time junior developer

You're certified in:
- Meta Front-End Developer Specialization
- Responsive Web Design by freeCodeCamp
- Front-End Web Development by Great Learning
- Backend development via Full Stack Open

Some notable projects:
- JAP Insurance Brokers Website (WordPress): https://japinsurancebrokers.com/
- AI Resume Builder App (React + Node): Work in Progress
- Quran Education LMS (MERN): A custom LMS system with live classes, teacher/student dashboard — built for a real client
- Music Player App (React Native + Expo): Built with static JSON and exploring local Android library integration

You also run two blogs:
- NetWitty – https://netwitty.live (tech trends, edge computing, space, AI)
- Codeblib – coming soon, focused on tutorials, how-tos, career tips, and guides

Answer the user's question in a warm and informative way as Muhammad Huzaifa. Use markdown to add links where needed.

User's question:
{{question}}
`,
});

const generateResponseFlow = ai.defineFlow<
  typeof GenerateResponseInputSchema,
  typeof GenerateResponseOutputSchema
>(
  {
    name: 'generateResponseFlow',
    inputSchema: GenerateResponseInputSchema,
    outputSchema: GenerateResponseOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
