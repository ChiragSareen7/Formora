import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

import { AIForm, FormSubmission } from './models/aiForm.model.js';

// Import DB_NAME from constants if available, otherwise use default
// Use lowercase to avoid MongoDB namespace issues
let DB_NAME;
try {
  const constants = await import('./constants.js');
  DB_NAME = (constants.DB_NAME || 'formora').toLowerCase();
} catch {
  DB_NAME = (process.env.DB_NAME || 'formora').toLowerCase();
}

const mongoURI = process.env.MongoDB_URI;

if (!mongoURI) {
  console.error('MongoDB_URI not found in environment variables');
  process.exit(1);
}

// Use connection string as-is - MongoDB will use the database from the connection string
// or create/use the default database
const connectionString = mongoURI;
console.log('📝 Connecting to MongoDB...');

async function seedDummyData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(connectionString);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // Use try-catch to handle cases where collections don't exist yet
    try {
      await AIForm.deleteMany({});
      await FormSubmission.deleteMany({});
      console.log('🗑️  Cleared existing data');
    } catch (error) {
      console.log('⚠️  No existing data to clear (collections may not exist yet)');
    }

    // Helper function to generate multiple questions for a form
    const generateShoeQuestions = (baseId, count) => {
      const questions = [];
      const questionTemplates = [
        { q: 'How would you rate the comfort of the shoes?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'What do you think about the price?', type: 'radio', opts: ['Too High', 'Just Right', 'Too Low', 'Not Sure'] },
        { q: 'How would you rate the overall design and looks?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'What is your overall satisfaction with the product?', type: 'radio', opts: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'] },
        { q: 'Rate the durability and build quality', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How would you rate the cushioning?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'Is the shoe true to size?', type: 'radio', opts: ['Yes', 'Runs Small', 'Runs Large', 'Not Sure'] },
        { q: 'Rate the breathability', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How would you rate the traction/grip?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'Would you purchase this product again?', type: 'radio', opts: ['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'] },
        { q: 'Rate the color options available', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How would you rate the weight of the shoes?', type: 'radio', opts: ['Too Light', 'Perfect', 'Too Heavy', 'Not Sure'] },
        { q: 'Rate the arch support', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How would you rate the overall value for money?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'Would you recommend these shoes to others?', type: 'radio', opts: ['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'] },
        { q: 'Rate the packaging and presentation', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How important is brand name to you?', type: 'radio', opts: ['Very Important', 'Important', 'Somewhat', 'Not Important'] },
        { q: 'Rate the overall quality compared to competitors', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How would you rate the customer service experience?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'What is your preferred price range?', type: 'select', opts: ['Under $50', '$50-$100', '$100-$150', '$150-$200', 'Above $200'] },
        { q: 'Rate the style and fashion appeal', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How would you rate the ease of cleaning?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'Rate the flexibility of the sole', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How would you rate the heel support?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'What is your primary use for these shoes?', type: 'select', opts: ['Running', 'Walking', 'Casual Wear', 'Sports', 'Gym', 'Other'] },
        { q: 'Rate the overall fit', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How would you rate the material quality?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'Rate the shock absorption', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'How would you rate the overall product experience?', type: 'rating', opts: ['1', '2', '3', '4', '5'] },
        { q: 'Any additional comments or suggestions?', type: 'textarea', opts: [] }
      ];

      for (let i = 0; i < count && i < questionTemplates.length; i++) {
        const template = questionTemplates[i];
        questions.push({
          questionId: `${baseId}_q${i + 1}`,
          question: template.q,
          inputType: template.type,
          options: template.opts,
          required: template.type !== 'textarea',
          placeholder: template.type === 'textarea' ? 'Share your thoughts...' : undefined,
          order: i + 1,
          isFollowUp: false
        });
      }
      return questions;
    };

    // Create dummy forms
    const dummyForms = [
      {
        formId: 'demo_form_shoe_review',
        businessDescription: 'Nike wants feedback on their new Air Max shoe line - comfort, price, looks, quality, and overall satisfaction',
        title: 'Nike Shoe Line Feedback Form',
        description: 'Provide your honest feedback on Nike\'s new shoe line to help us improve our products.',
        initialQuestions: generateShoeQuestions('demo_form_shoe_review', 30),
        isActive: true,
        createdAt: new Date('2025-12-17'),
        updatedAt: new Date('2025-12-17')
      },
      {
        formId: 'demo_form_shoe_review_2',
        businessDescription: 'Nike wants comprehensive feedback on their new shoe line - design, comfort, durability, price point, and customer satisfaction',
        title: 'Nike Shoe Line Feedback Form',
        description: 'Share your honest feedback about our new shoe line to help us improve and create better products.',
        initialQuestions: generateShoeQuestions('demo_form_shoe_review_2', 35),
        isActive: true,
        createdAt: new Date('2025-12-15'),
        updatedAt: new Date('2025-12-15')
      },
      {
        formId: 'demo_form_shoe_review_3',
        businessDescription: 'Nike seeks detailed customer feedback on their latest shoe collection - focusing on comfort, style, performance, and value',
        title: 'Nike Shoe Line Feedback Form',
        description: 'Share your thoughts on Nike\'s new shoe line to help us improve our products.',
        initialQuestions: generateShoeQuestions('demo_form_shoe_review_3', 30),
        isActive: true,
        createdAt: new Date('2025-12-10'),
        updatedAt: new Date('2025-12-10')
      },
      {
        formId: 'demo_form_restaurant_feedback',
        businessDescription: 'A local restaurant wants customer feedback on food quality, service, ambiance, and value for money',
        title: 'Restaurant Experience Feedback',
        description: 'We value your opinion! Please share your dining experience with us',
        initialQuestions: [
          {
            questionId: 'q1',
            question: 'How would you rate the food quality?',
            inputType: 'rating',
            options: ['1', '2', '3', '4', '5'],
            required: true,
            order: 1,
            isFollowUp: false
          },
          {
            questionId: 'q2',
            question: 'How was the service?',
            inputType: 'radio',
            options: ['Excellent', 'Good', 'Average', 'Poor'],
            required: true,
            order: 2,
            isFollowUp: false
          },
          {
            questionId: 'q3',
            question: 'Rate the ambiance and atmosphere',
            inputType: 'rating',
            options: ['1', '2', '3', '4', '5'],
            required: true,
            order: 3,
            isFollowUp: false
          },
          {
            questionId: 'q4',
            question: 'Was the meal value for money?',
            inputType: 'radio',
            options: ['Yes, great value', 'Reasonable', 'Overpriced', 'Not sure'],
            required: true,
            order: 4,
            isFollowUp: false
          }
        ],
        isActive: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        formId: 'demo_form_app_feedback',
        businessDescription: 'A mobile app company wants user feedback on app features, usability, performance, and suggestions for improvements',
        title: 'Mobile App User Feedback',
        description: 'Help us make our app better! Share your experience and suggestions',
        initialQuestions: [
          {
            questionId: 'q1',
            question: 'How easy is the app to use?',
            inputType: 'rating',
            options: ['1', '2', '3', '4', '5'],
            required: true,
            order: 1,
            isFollowUp: false
          },
          {
            questionId: 'q2',
            question: 'How would you rate the app performance?',
            inputType: 'radio',
            options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
            required: true,
            order: 2,
            isFollowUp: false
          },
          {
            questionId: 'q3',
            question: 'Which features do you use most?',
            inputType: 'select',
            options: ['Messaging', 'Profile', 'Settings', 'Search', 'Notifications', 'All of them'],
            required: true,
            order: 3,
            isFollowUp: false
          },
          {
            questionId: 'q4',
            question: 'Would you recommend this app to others?',
            inputType: 'radio',
            options: ['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'],
            required: true,
            order: 4,
            isFollowUp: false
          }
        ],
        isActive: true,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25')
      }
    ];

    // Save forms one by one to avoid bulk write issues
    const savedForms = [];
    for (const form of dummyForms) {
      try {
        const savedForm = await new AIForm(form).save();
        savedForms.push(savedForm);
        console.log(`✅ Created form: ${savedForm.title}`);
      } catch (error) {
        console.error(`❌ Error saving form ${form.title}:`, error.message);
        // Continue with next form
      }
    }
    console.log(`✅ Created ${savedForms.length} dummy forms`);

    // Create dummy submissions for each form
    const submissions = [];

    // Helper function to generate responses for a form
    const generateResponses = (form, questionPrefix, count) => {
      const responses = [];
      const formQuestions = form.initialQuestions || [];
      
      formQuestions.forEach((q, idx) => {
        if (idx < count) {
          let answer;
          if (q.inputType === 'rating') {
            answer = String(Math.floor(Math.random() * 5) + 1);
          } else if (q.inputType === 'radio' && q.options && q.options.length > 0) {
            answer = q.options[Math.floor(Math.random() * q.options.length)];
          } else if (q.inputType === 'select' && q.options && q.options.length > 0) {
            answer = q.options[Math.floor(Math.random() * q.options.length)];
          } else if (q.inputType === 'textarea') {
            const comments = [
              'Great product overall!',
              'Could be better in some areas.',
              'Excellent quality and design.',
              'Good value for money.',
              'Needs improvement.',
              'Very satisfied with purchase.',
              'Would recommend to others.'
            ];
            answer = comments[Math.floor(Math.random() * comments.length)];
          } else {
            answer = 'Sample answer';
          }
          responses.push({ questionId: q.questionId, answer });
        }
      });
      return responses;
    };

    // Submissions for Shoe Review Form 1
    const shoeForm = savedForms.find(f => f.formId === 'demo_form_shoe_review');
    if (shoeForm) {
      const shoeSubmissions = [];
      const baseDate = new Date('2025-12-17');
      for (let i = 0; i < 12; i++) {
        const submissionDate = new Date(baseDate);
        submissionDate.setDate(baseDate.getDate() + Math.floor(i / 3));
        submissionDate.setHours(10 + (i % 3) * 2, 30 + (i % 2) * 15, 0);
        shoeSubmissions.push({
          formId: shoeForm.formId,
          responses: generateResponses(shoeForm, 'demo_form_shoe_review', 30),
          completedAt: submissionDate
        });
      }
      submissions.push(...shoeSubmissions);
    }

    // Submissions for Shoe Review Form 2
    const shoeForm2 = savedForms.find(f => f.formId === 'demo_form_shoe_review_2');
    if (shoeForm2) {
      const shoeSubmissions2 = [];
      const baseDate2 = new Date('2025-12-15');
      for (let i = 0; i < 15; i++) {
        const submissionDate = new Date(baseDate2);
        submissionDate.setDate(baseDate2.getDate() + Math.floor(i / 3));
        submissionDate.setHours(9 + (i % 3) * 2, 15 + (i % 2) * 30, 0);
        shoeSubmissions2.push({
          formId: shoeForm2.formId,
          responses: generateResponses(shoeForm2, 'demo_form_shoe_review_2', 35),
          completedAt: submissionDate
        });
      }
      submissions.push(...shoeSubmissions2);
    }

    // Submissions for Shoe Review Form 3
    const shoeForm3 = savedForms.find(f => f.formId === 'demo_form_shoe_review_3');
    if (shoeForm3) {
      const shoeSubmissions3 = [];
      const baseDate3 = new Date('2025-12-10');
      for (let i = 0; i < 10; i++) {
        const submissionDate = new Date(baseDate3);
        submissionDate.setDate(baseDate3.getDate() + Math.floor(i / 2));
        submissionDate.setHours(11 + (i % 2) * 3, 20 + (i % 3) * 15, 0);
        shoeSubmissions3.push({
          formId: shoeForm3.formId,
          responses: generateResponses(shoeForm3, 'demo_form_shoe_review_3', 30),
          completedAt: submissionDate
        });
      }
      submissions.push(...shoeSubmissions3);
    }


    // Submissions for Restaurant Form
    const restaurantForm = savedForms.find(f => f.formId === 'demo_form_restaurant_feedback');
    if (restaurantForm) {
      const restaurantSubmissions = [
        {
          formId: restaurantForm.formId,
          responses: [
            { questionId: 'q1', answer: '5' },
            { questionId: 'q2', answer: 'Excellent' },
            { questionId: 'q3', answer: '4' },
            { questionId: 'q4', answer: 'Yes, great value' }
          ],
          completedAt: new Date('2024-01-21T12:30:00')
        },
        {
          formId: restaurantForm.formId,
          responses: [
            { questionId: 'q1', answer: '4' },
            { questionId: 'q2', answer: 'Good' },
            { questionId: 'q3', answer: '4' },
            { questionId: 'q4', answer: 'Reasonable' }
          ],
          completedAt: new Date('2024-01-21T19:15:00')
        },
        {
          formId: restaurantForm.formId,
          responses: [
            { questionId: 'q1', answer: '3' },
            { questionId: 'q2', answer: 'Average' },
            { questionId: 'q3', answer: '3' },
            { questionId: 'q4', answer: 'Overpriced' }
          ],
          completedAt: new Date('2024-01-22T13:20:00')
        },
        {
          formId: restaurantForm.formId,
          responses: [
            { questionId: 'q1', answer: '5' },
            { questionId: 'q2', answer: 'Excellent' },
            { questionId: 'q3', answer: '5' },
            { questionId: 'q4', answer: 'Yes, great value' }
          ],
          completedAt: new Date('2024-01-22T20:00:00')
        },
        {
          formId: restaurantForm.formId,
          responses: [
            { questionId: 'q1', answer: '2' },
            { questionId: 'q2', answer: 'Poor' },
            { questionId: 'q3', answer: '2' },
            { questionId: 'q4', answer: 'Overpriced' }
          ],
          completedAt: new Date('2024-01-23T14:30:00')
        }
      ];
      submissions.push(...restaurantSubmissions);
    }

    // Submissions for App Feedback Form
    const appForm = savedForms.find(f => f.formId === 'demo_form_app_feedback');
    if (appForm) {
      const appSubmissions = [
        {
          formId: appForm.formId,
          responses: [
            { questionId: 'q1', answer: '5' },
            { questionId: 'q2', answer: 'Excellent' },
            { questionId: 'q3', answer: 'Messaging' },
            { questionId: 'q4', answer: 'Definitely' }
          ],
          completedAt: new Date('2024-01-26T08:30:00')
        },
        {
          formId: appForm.formId,
          responses: [
            { questionId: 'q1', answer: '4' },
            { questionId: 'q2', answer: 'Good' },
            { questionId: 'q3', answer: 'Profile' },
            { questionId: 'q4', answer: 'Probably' }
          ],
          completedAt: new Date('2024-01-26T11:15:00')
        },
        {
          formId: appForm.formId,
          responses: [
            { questionId: 'q1', answer: '3' },
            { questionId: 'q2', answer: 'Average' },
            { questionId: 'q3', answer: 'Search' },
            { questionId: 'q4', answer: 'Maybe' }
          ],
          completedAt: new Date('2024-01-27T09:45:00')
        },
        {
          formId: appForm.formId,
          responses: [
            { questionId: 'q1', answer: '4' },
            { questionId: 'q2', answer: 'Good' },
            { questionId: 'q3', answer: 'All of them' },
            { questionId: 'q4', answer: 'Definitely' }
          ],
          completedAt: new Date('2024-01-27T15:20:00')
        },
        {
          formId: appForm.formId,
          responses: [
            { questionId: 'q1', answer: '2' },
            { questionId: 'q2', answer: 'Poor' },
            { questionId: 'q3', answer: 'Settings' },
            { questionId: 'q4', answer: 'Probably Not' }
          ],
          completedAt: new Date('2024-01-28T10:00:00')
        },
        {
          formId: appForm.formId,
          responses: [
            { questionId: 'q1', answer: '5' },
            { questionId: 'q2', answer: 'Excellent' },
            { questionId: 'q3', answer: 'Notifications' },
            { questionId: 'q4', answer: 'Definitely' }
          ],
          completedAt: new Date('2024-01-28T16:30:00')
        }
      ];
      submissions.push(...appSubmissions);
    }

    // Save submissions one by one
    if (submissions.length > 0) {
      let savedCount = 0;
      for (const submission of submissions) {
        try {
          await new FormSubmission(submission).save();
          savedCount++;
        } catch (error) {
          console.error(`❌ Error saving submission:`, error.message);
          // Continue with next submission
        }
      }
      console.log(`✅ Created ${savedCount} dummy submissions`);
    }

    console.log('\n🎉 Dummy data seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Forms created: ${savedForms.length}`);
    console.log(`   - Submissions created: ${submissions.length}`);
    console.log('\n📝 Form IDs:');
    savedForms.forEach(form => {
      const formSubmissions = submissions.filter(s => s.formId === form.formId);
      console.log(`   - ${form.formId}: ${formSubmissions.length} submissions`);
    });

  } catch (error) {
    console.error('❌ Error seeding dummy data:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

// Run the seed function
seedDummyData()
  .then(() => {
    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });

