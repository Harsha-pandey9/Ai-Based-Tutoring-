export const categories = [
  {
    name: "Quantitative Aptitude",
    subcategories: [
      "Numbers",
      "Percentages", 
      "Profit & Loss",
      "Time, Speed, Distance",
      "Simple & Compound Interest",
      "Probability, Permutations & Combinations",
      "Ratio & Proportion, Mixtures",
      "Pipes & Cisterns, Work & Time"
    ]
  },
  {
    name: "Logical Reasoning",
    subcategories: [
      "Puzzles",
      "Blood Relations",
      "Coding-Decoding",
      "Direction Sense", 
      "Seating Arrangement",
      "Series Completion"
    ]
  },
  {
    name: "Verbal Ability",
    subcategories: [
      "Grammar (Sentence Correction, Fill in the blanks)",
      "Reading Comprehension",
      "Synonyms/Antonyms",
      "Para Jumbles"
    ]
  },
  {
    name: "Technical Aptitude",
    subcategories: [
      "Basic Programming (C, C++, Java, Python MCQs)",
      "DBMS, OS, Computer Networks basics"
    ]
  }
];

export const difficulties = ["easy", "medium", "hard"];

// Enhanced questions with realistic content
export const questions = [
  // Quantitative Aptitude - Numbers
  {
    id: 1,
    category: "Quantitative Aptitude",
    subcategory: "Numbers",
    difficulty: "easy",
    question: "What is the sum of first 10 natural numbers?",
    options: ["45", "50", "55", "60"],
    correct: 2
  },
  {
    id: 2,
    category: "Quantitative Aptitude", 
    subcategory: "Numbers",
    difficulty: "easy",
    question: "Which of the following is a prime number?",
    options: ["15", "21", "23", "27"],
    correct: 2
  },
  {
    id: 3,
    category: "Quantitative Aptitude",
    subcategory: "Numbers",
    difficulty: "medium",
    question: "Find the LCM of 12, 15, and 20.",
    options: ["60", "120", "180", "240"],
    correct: 0
  },
  {
    id: 4,
    category: "Quantitative Aptitude",
    subcategory: "Numbers",
    difficulty: "hard",
    question: "If the sum of three consecutive odd numbers is 63, what is the largest number?",
    options: ["19", "21", "23", "25"],
    correct: 2
  },

  // Quantitative Aptitude - Percentages
  {
    id: 5,
    category: "Quantitative Aptitude",
    subcategory: "Percentages",
    difficulty: "easy",
    question: "What is 25% of 80?",
    options: ["15", "20", "25", "30"],
    correct: 1
  },
  {
    id: 6,
    category: "Quantitative Aptitude",
    subcategory: "Percentages", 
    difficulty: "medium",
    question: "If a number is increased by 20% and then decreased by 20%, what is the net change?",
    options: ["0%", "4% decrease", "4% increase", "No change"],
    correct: 1
  },
  {
    id: 7,
    category: "Quantitative Aptitude",
    subcategory: "Percentages",
    difficulty: "hard",
    question: "A shopkeeper marks his goods 40% above cost price and gives a discount of 25%. What is his profit percentage?",
    options: ["5%", "10%", "15%", "20%"],
    correct: 0
  },

  // Logical Reasoning - Puzzles
  {
    id: 8,
    category: "Logical Reasoning",
    subcategory: "Puzzles",
    difficulty: "easy",
    question: "If all roses are flowers and some flowers are red, which conclusion is definitely true?",
    options: ["All roses are red", "Some roses are red", "No roses are red", "Cannot be determined"],
    correct: 3
  },
  {
    id: 9,
    category: "Logical Reasoning",
    subcategory: "Puzzles",
    difficulty: "medium", 
    question: "In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?",
    options: ["EOJDEJFM", "EOJDJEFM", "EOJDEJNF", "EOJDJFEM"],
    correct: 0
  },

  // Verbal Ability - Grammar
  {
    id: 10,
    category: "Verbal Ability",
    subcategory: "Grammar (Sentence Correction, Fill in the blanks)",
    difficulty: "easy",
    question: "Choose the correct sentence:",
    options: [
      "Neither of the boys were present",
      "Neither of the boys was present", 
      "Neither of the boy were present",
      "Neither of the boy was present"
    ],
    correct: 1
  },
  {
    id: 11,
    category: "Verbal Ability",
    subcategory: "Synonyms/Antonyms",
    difficulty: "easy",
    question: "What is the synonym of 'Abundant'?",
    options: ["Scarce", "Plentiful", "Limited", "Rare"],
    correct: 1
  },

  // Technical Aptitude - Programming
  {
    id: 12,
    category: "Technical Aptitude",
    subcategory: "Basic Programming (C, C++, Java, Python MCQs)",
    difficulty: "easy",
    question: "Which of the following is not a programming language?",
    options: ["Python", "Java", "HTML", "C++"],
    correct: 2
  },
  {
    id: 13,
    category: "Technical Aptitude",
    subcategory: "Basic Programming (C, C++, Java, Python MCQs)",
    difficulty: "medium",
    question: "What is the output of: print(2 ** 3) in Python?",
    options: ["6", "8", "9", "Error"],
    correct: 1
  },
  {
    id: 14,
    category: "Technical Aptitude",
    subcategory: "DBMS, OS, Computer Networks basics",
    difficulty: "easy",
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query Language", 
      "Standard Query Language",
      "System Query Language"
    ],
    correct: 0
  }
];

// Function to generate additional sample questions to reach desired count
function generateAdditionalQuestions() {
  let id = 15;
  
  const sampleQuestions = [
    // More Quantitative Aptitude questions
    {
      category: "Quantitative Aptitude",
      subcategory: "Profit & Loss",
      difficulty: "easy",
      question: "A man buys an article for Rs. 100 and sells it for Rs. 120. What is his profit percentage?",
      options: ["15%", "20%", "25%", "30%"],
      correct: 1
    },
    {
      category: "Quantitative Aptitude", 
      subcategory: "Time, Speed, Distance",
      difficulty: "medium",
      question: "A car travels 60 km in 1 hour. How much time will it take to travel 180 km?",
      options: ["2 hours", "3 hours", "4 hours", "5 hours"],
      correct: 1
    },
    {
      category: "Quantitative Aptitude",
      subcategory: "Simple & Compound Interest",
      difficulty: "medium",
      question: "What is the simple interest on Rs. 1000 for 2 years at 5% per annum?",
      options: ["Rs. 50", "Rs. 100", "Rs. 150", "Rs. 200"],
      correct: 1
    },
    
    // More Logical Reasoning questions
    {
      category: "Logical Reasoning",
      subcategory: "Blood Relations",
      difficulty: "easy",
      question: "If A is the brother of B and B is the sister of C, then A is C's:",
      options: ["Brother", "Sister", "Cousin", "Cannot be determined"],
      correct: 0
    },
    {
      category: "Logical Reasoning",
      subcategory: "Direction Sense",
      difficulty: "medium",
      question: "A person walks 10m North, then 10m East, then 10m South. How far is he from the starting point?",
      options: ["10m", "20m", "30m", "0m"],
      correct: 0
    },
    {
      category: "Logical Reasoning",
      subcategory: "Series Completion",
      difficulty: "easy",
      question: "Find the next number in the series: 2, 4, 8, 16, ?",
      options: ["24", "28", "32", "36"],
      correct: 2
    },
    
    // More Verbal Ability questions
    {
      category: "Verbal Ability",
      subcategory: "Reading Comprehension",
      difficulty: "medium",
      question: "Choose the word that best completes the sentence: 'The weather was so _____ that we decided to stay indoors.'",
      options: ["pleasant", "inclement", "moderate", "favorable"],
      correct: 1
    },
    {
      category: "Verbal Ability",
      subcategory: "Para Jumbles",
      difficulty: "hard",
      question: "Arrange the sentences in logical order: P) The sun was setting Q) Birds were returning to their nests R) The sky turned orange S) It was evening",
      options: ["SPQR", "SRPQ", "PSRQ", "SQRP"],
      correct: 1
    },
    
    // More Technical questions
    {
      category: "Technical Aptitude",
      subcategory: "Basic Programming (C, C++, Java, Python MCQs)",
      difficulty: "hard",
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1
    },
    {
      category: "Technical Aptitude",
      subcategory: "DBMS, OS, Computer Networks basics",
      difficulty: "medium",
      question: "Which of the following is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"],
      correct: 2
    }
  ];

  // Generate multiple variations for each difficulty level
  categories.forEach(category => {
    category.subcategories.forEach(subcategory => {
      difficulties.forEach(difficulty => {
        // Add base questions
        const baseQuestions = sampleQuestions.filter(q => 
          q.category === category.name && 
          q.subcategory === subcategory && 
          q.difficulty === difficulty
        );
        
        baseQuestions.forEach(baseQ => {
          questions.push({
            id: id++,
            ...baseQ
          });
        });
        
        // Generate additional variations to ensure enough questions
        for (let i = 0; i < 8; i++) {
          const templates = {
            easy: [
              "Basic concept question about {topic}",
              "Simple calculation involving {topic}",
              "Fundamental principle of {topic}",
              "Elementary problem in {topic}"
            ],
            medium: [
              "Intermediate level question on {topic}",
              "Application-based problem in {topic}",
              "Moderate difficulty question about {topic}",
              "Standard problem involving {topic}"
            ],
            hard: [
              "Advanced concept in {topic}",
              "Complex problem involving {topic}",
              "Challenging question about {topic}",
              "Expert level problem in {topic}"
            ]
          };
          
          const template = templates[difficulty][i % templates[difficulty].length];
          const questionText = template.replace('{topic}', subcategory);
          
          questions.push({
            id: id++,
            category: category.name,
            subcategory: subcategory,
            difficulty: difficulty,
            question: questionText,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct: Math.floor(Math.random() * 4)
          });
        }
      });
    });
  });
}

generateAdditionalQuestions();

console.log(`Generated ${questions.length} questions across all categories and difficulties`);