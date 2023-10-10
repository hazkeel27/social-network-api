const connection = require('../config/connection');
const { Thought, User } = require('../models');

// array of user data
const userData = [
  {
    username: 'john_doe',
    email: 'john@example.com',
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
  },
  {
    username: 'alice_wonderland',
    email: 'alice@example.com',
  },
  {
    username: 'bob_marley',
    email: 'bob@example.com',
  },
  {
    username: 'emily_parker',
    email: 'emily@example.com',
  },
];

// array of thought data
const thoughtData = [
  {
    thoughtText: 'I love programming!',
    username: 'john_doe',
  },
  {
    thoughtText: 'Exploring new technologies.',
    username: 'jane_smith',
  },
  {
    thoughtText: 'Reading a good book.',
    username: 'alice_wonderland',
  },
  {
    thoughtText: 'Listening to reggae music.',
    username: 'bob_marley',
  },
  {
    thoughtText: 'Taking a walk in the park.',
    username: 'emily_parker',
  },
];

connection.on('error', (err) => err);

// Call the seedDatabase function to seed the data
connection.once(`open`, async () => {
  console.log(`connected`);

  // Clear existing data
  await User.deleteMany({});
  await Thought.deleteMany({});

  // Insert user data
  const users = await User.insertMany(userData);

  // Insert thought data
  const thoughts = await Thought.insertMany(
    thoughtData.map((thought) => ({
      ...thought,
      username: users.find((user) => user.username === thought.username).username,
    }))
  );

  console.log(users);
  console.log(thoughts);
  
  console.log('Data seeded successfully');
  process.exit(0);
});
