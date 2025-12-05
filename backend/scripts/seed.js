require('dotenv').config();
const db = require('../config/database');

// Sample questions for seeding
const sampleQuestions = [
  {
    question_text: "Choose the correct form: I ___ to the store yesterday.",
    question_type: "multiple_choice",
    level: "A1",
    topic: "grammar",
    difficulty: 3,
    options: ["go", "went", "going", "goes"],
    correct_answer: "went",
    explanation: "We use 'went' (past tense of 'go') because 'yesterday' indicates a past action.",
    grammar_rule: "Simple Past Tense: Use the past form of the verb for actions completed in the past.",
    example_sentences: ["I went to school yesterday.", "She went home early."],
    xp_reward: 10
  },
  {
    question_text: "Fill in the blank: She ___ English every day.",
    question_type: "fill_blank",
    level: "A1",
    topic: "grammar",
    difficulty: 2,
    options: null,
    correct_answer: "studies",
    explanation: "We use 'studies' (third person singular) because the subject is 'she'.",
    grammar_rule: "Present Simple: For third person singular (he/she/it), add -s or -es to the verb.",
    example_sentences: ["He studies hard.", "She works every day."],
    xp_reward: 10
  },
  {
    question_text: "Arrange the words to form a correct sentence:",
    question_type: "sentence_order",
    level: "A2",
    topic: "grammar",
    difficulty: 4,
    options: ["I", "am", "going", "to", "the", "park", "tomorrow"],
    correct_answer: ["I", "am", "going", "to", "the", "park", "tomorrow"],
    explanation: "This is the correct word order for a future plan using 'going to'.",
    grammar_rule: "Future with 'going to': Subject + am/is/are + going to + base verb + object + time.",
    example_sentences: ["I am going to visit my friend.", "She is going to buy a car."],
    xp_reward: 15
  },
  {
    question_text: "What is the past participle of 'eat'?",
    question_type: "multiple_choice",
    level: "A2",
    topic: "grammar",
    difficulty: 3,
    options: ["ate", "eaten", "eating", "eats"],
    correct_answer: "eaten",
    explanation: "'Eaten' is the past participle form, used with 'have/has' in perfect tenses.",
    grammar_rule: "Past participles are used with auxiliary verbs (have/has/had) in perfect tenses.",
    example_sentences: ["I have eaten lunch.", "She had eaten before arriving."],
    xp_reward: 10
  },
  {
    question_text: "Choose the correct word: I need ___ water.",
    question_type: "multiple_choice",
    level: "A1",
    topic: "vocabulary",
    difficulty: 2,
    options: ["a", "an", "some", "the"],
    correct_answer: "some",
    explanation: "We use 'some' with uncountable nouns like 'water'.",
    grammar_rule: "Use 'some' with uncountable nouns and plural countable nouns in positive sentences.",
    example_sentences: ["I need some help.", "She wants some coffee."],
    xp_reward: 10
  }
];

const seedQuestions = async () => {
  try {
    console.log('🌱 Seeding sample questions...');
    
    // Initialize database connection
    await db.init();

    for (const q of sampleQuestions) {
      await db.query(
        `INSERT INTO questions (
          question_text, question_type, level, topic, difficulty, options, 
          correct_answer, explanation, grammar_rule, example_sentences, xp_reward, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
        ON CONFLICT DO NOTHING`,
        [
          q.question_text,
          q.question_type,
          q.level,
          q.topic,
          q.difficulty,
          JSON.stringify(q.options),
          JSON.stringify(q.correct_answer),
          q.explanation,
          q.grammar_rule,
          JSON.stringify(q.example_sentences),
          q.xp_reward
        ]
      );
    }

    console.log(`✅ Seeded ${sampleQuestions.length} sample questions!`);
    console.log('💡 Note: You can add more questions via the API or admin panel.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    process.exit(1);
  }
};

seedQuestions();
