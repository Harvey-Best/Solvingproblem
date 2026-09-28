import { PLANS, TRIAL_DAYS } from "@/lib/plans";

/**
 * Short answers under the diagnose and quote tools, also published as
 * FAQPage structured data, so the tool pages explain themselves to people
 * and to search and AI engines. Keep them true to what the app does.
 */
type Faq = { q: string; a: string };

const PRICE_ANSWER = `It's free with no account. After that, creating an account starts a ${TRIAL_DAYS}-day free trial with no card, then it's ${PLANS.monthly.priceLabel} or ${PLANS.yearly.priceLabel}.`;

export const DIAGNOSE_FAQS: Faq[] = [
  {
    q: "What photos work best?",
    a: "One close-up of the problem and one wider shot that shows where it is, in good light. You can add up to three photos. A sentence about when it started, or what it sounds or smells like, sharpens the answer.",
  },
  {
    q: "What do I get back?",
    a: "The likely cause with a confidence level, how urgent it is, and whether it's a DIY job. You also get step-by-step instructions with tools and parts (with prices and store links), a typical price range for a pro, and what to tell them.",
  },
  {
    q: "How long does it take?",
    a: "Usually about 30 seconds. You can answer follow-up questions afterwards to refine the diagnosis.",
  },
  {
    q: "What if it's dangerous?",
    a: 'A gas smell, sparking or burning, water near electrical, a sagging ceiling or structure, and carbon monoxide alarms are always escalated to "Stop and call a pro now", with the safety steps to take first. If you smell gas or see smoke, leave and call 911 or your gas utility.',
  },
  { q: "Is my first diagnosis free?", a: `Yes. ${PRICE_ANSWER}` },
];

export const QUOTE_FAQS: Faq[] = [
  {
    q: "What does a quote check look for?",
    a: "What the quote covers and what's missing, red flags such as a deposit over 30% or no license number, and whether the total falls within a typical price range for the job. You also get questions to ask the contractor before you sign.",
  },
  {
    q: "What should I photograph?",
    a: "Every page of the quote, including the line items, the total, the payment terms and the contractor's details. You can add up to three photos.",
  },
  {
    q: "Is a large deposit a red flag?",
    a: "Often, yes. A common guideline is 30% or less up front, and some states cap it. Ask to tie payments to finished milestones instead.",
  },
  {
    q: "Does it tell me whether the contractor is good?",
    a: "No. It reviews the quote itself. Look up their license with your state board, read reviews, and get two or three quotes for bigger jobs.",
  },
  { q: "Is my first quote check free?", a: `Yes. ${PRICE_ANSWER}` },
];
