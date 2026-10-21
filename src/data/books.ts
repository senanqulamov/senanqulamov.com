export type BookTheme = "psych" | "eng" | "build" | "lead";

export type Book = {
  theme: BookTheme;
  title: string;
  author: string;
  year: number;
  /** Cover color. */
  color: string;
  why: string;
  quote?: string;
};

export const bookThemes: Record<BookTheme, string> = {
  psych: "Psychology",
  eng: "Engineering",
  build: "Building",
  lead: "Leadership",
};

export const books: Book[] = [
  {
    theme: "psych",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    year: 1946,
    color: "#6b2c1a",
    why: "The book that taught me people survive almost anything when the thing they are doing means something. I use it every time a team is exhausted: the fix is rarely more hours, it is a clearer why.",
    quote: "the last of the human freedoms",
  },
  {
    theme: "psych",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    year: 2011,
    color: "#2d4a3e",
    why: "It made me distrust my own certainty. Estimates, hiring calls and product bets all got slower and better once I started asking which system in my head was actually talking.",
    quote: "Nothing in life is as important as you think it is",
  },
  {
    theme: "psych",
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    year: 2014,
    color: "#3a2a4a",
    why: "Essential reading for the therapy side of my work, and quietly useful for the engineering side too. Stress lives in the body long before it shows up in a status update.",
    quote: "The body keeps the score",
  },
  {
    theme: "psych",
    title: "Nonviolent Communication",
    author: "Marshall B. Rosenberg",
    year: 1999,
    color: "#7a5a1e",
    why: "A grammar for difficult conversations: observation, feeling, need, request. It changed how I give code review feedback more than any engineering book has.",
    quote: "What's alive in you?",
  },
  {
    theme: "eng",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt, David Thomas",
    year: 1999,
    color: "#1e3a5a",
    why: "The first book that made me feel like a craftsman instead of someone typing syntax. Its warning about small neglected faults is still the rule I repeat most often to juniors.",
    quote: "Don't live with broken windows",
  },
  {
    theme: "eng",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    year: 2017,
    color: "#5a1e2c",
    why: "The reference I reach for whenever a system has to survive real traffic. It gave me the vocabulary to argue about trade-offs instead of defending favourite tools.",
    quote: "reliable, scalable, maintainable",
  },
  {
    theme: "eng",
    title: "Clean Architecture",
    author: "Robert C. Martin",
    year: 2017,
    color: "#2a2a2a",
    why: "Useful less as a rulebook than as a way of asking what a system will cost to change in two years. That question now shapes every project I start.",
    quote: "The goal of architecture is to minimize the human resources required",
  },
  {
    theme: "eng",
    title: "Refactoring",
    author: "Martin Fowler",
    year: 1999,
    color: "#4a3a1e",
    why: "Proof that code is written for people first. I still run the small, boring moves in this book before touching anything risky in a legacy codebase.",
    quote: "Any fool can write code that a computer understands",
  },
  {
    theme: "build",
    title: "Zero to One",
    author: "Peter Thiel",
    year: 2014,
    color: "#0f2a3a",
    why: "It pushed me to look for products that are different in kind, not degree. BidBary exists partly because of the question of what nobody else is building here.",
    quote: "Competition is for losers",
  },
  {
    theme: "build",
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    year: 2014,
    color: "#3a1414",
    why: "The most honest book about the days when nothing is going well. It is the one I lend to founders who think their struggle means they picked the wrong idea.",
    quote: "There are no silver bullets, only lead bullets",
  },
  {
    theme: "build",
    title: "The Mom Test",
    author: "Rob Fitzpatrick",
    year: 2013,
    color: "#1e4a3a",
    why: "A short book that saved me months. Every discovery call I run now asks about what people already did, never about what they think they would do.",
    quote: "Opinions are worthless",
  },
  {
    theme: "build",
    title: "Shape Up",
    author: "Ryan Singer",
    year: 2019,
    color: "#5a4a14",
    why: "Where my delivery rhythm comes from: fix the time, shape the work, give the team room to make the calls. It is why clients get weekly cuts instead of promises.",
    quote: "Fixed time, variable scope",
  },
  {
    theme: "lead",
    title: "Radical Candor",
    author: "Kim Scott",
    year: 2017,
    color: "#6a1e1e",
    why: "It named the thing I already believed as a therapist: caring about someone and telling them the truth are the same act, not opposites.",
    quote: "Care personally, challenge directly",
  },
  {
    theme: "lead",
    title: "Turn the Ship Around!",
    author: "L. David Marquet",
    year: 2012,
    color: "#14304a",
    why: "The book behind how I run teams. Moving from asking permission to stating intent turned my engineers into owners, and freed me from being the bottleneck.",
    quote: "I intend to...",
  },
  {
    theme: "lead",
    title: "The Five Dysfunctions of a Team",
    author: "Patrick Lencioni",
    year: 2002,
    color: "#2c3a14",
    why: "A clear map of why teams stall, and it always starts lower than people expect. When delivery slips, I check trust before I check the sprint board.",
    quote: "Trust is the foundation of real teamwork",
  },
  {
    theme: "lead",
    title: "An Elegant Puzzle",
    author: "Will Larson",
    year: 2019,
    color: "#3a2c4a",
    why: "Engineering management treated as a systems problem, which finally made the job feel solvable. Its thinking on where to put your limited attention shows up in every plan I write.",
  },
];
