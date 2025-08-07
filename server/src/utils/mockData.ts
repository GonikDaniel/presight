import { faker } from '@faker-js/faker';
import type { User, FilterItem } from '../types/index.js';

// Predefined lists for consistent data
const NATIONALITIES = [
  'American',
  'British',
  'Canadian',
  'Australian',
  'German',
  'French',
  'Italian',
  'Spanish',
  'Japanese',
  'Chinese',
  'Korean',
  'Indian',
  'Brazilian',
  'Mexican',
  'Russian',
  'Swedish',
  'Dutch',
  'Swiss',
  'Norwegian',
  'Danish',
  'Finnish',
  'Polish',
  'Czech',
  'Hungarian',
  'Romanian',
  'Bulgarian',
  'Greek',
  'Turkish',
  'Portuguese',
  'Irish',
  'Scottish',
  'Welsh',
  'New Zealander',
  'South African',
] as const;

const HOBBIES = [
  'Reading',
  'Writing',
  'Photography',
  'Cooking',
  'Baking',
  'Gardening',
  'Painting',
  'Drawing',
  'Sculpting',
  'Knitting',
  'Crocheting',
  'Sewing',
  'Woodworking',
  'Metalworking',
  'Pottery',
  'Jewelry Making',
  'Calligraphy',
  'Origami',
  'Paper Crafting',
  'Scrapbooking',
  'Collecting',
  'Gaming',
  'Puzzle Solving',
  'Chess',
  'Board Games',
  'Card Games',
  'Magic Tricks',
  'Juggling',
  'Dancing',
  'Singing',
  'Playing Music',
  'Composing Music',
  'Acting',
  'Stand-up Comedy',
  'Poetry',
  'Blogging',
  'Vlogging',
  'Podcasting',
  'Streaming',
  'Coding',
  'Web Design',
  'Graphic Design',
  'Animation',
  'Video Editing',
  'Sound Design',
  'Film Making',
  'Astronomy',
  'Bird Watching',
  'Hiking',
  'Camping',
  'Fishing',
  'Hunting',
  'Rock Climbing',
  'Mountain Biking',
  'Cycling',
  'Running',
  'Swimming',
  'Yoga',
  'Meditation',
  'Martial Arts',
  'Boxing',
  'Wrestling',
  'Tennis',
  'Golf',
  'Basketball',
  'Soccer',
  'Baseball',
  'Volleyball',
  'Badminton',
  'Table Tennis',
  'Bowling',
  'Skating',
  'Skiing',
  'Snowboarding',
  'Surfing',
  'Scuba Diving',
  'Sailing',
  'Kayaking',
  'Canoeing',
  'Rafting',
  'Paragliding',
  'Skydiving',
  'Bungee Jumping',
  'Rock Climbing',
  'Caving',
  'Geocaching',
  'Urban Exploration',
] as const;

export function generateMockData(count: number = 1000): User[] {
  const data: User[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    // Generate 0-10 random hobbies
    const numHobbies = Math.floor(Math.random() * 11); // 0 to 10
    const userHobbies: string[] = [];

    if (numHobbies > 0) {
      const shuffledHobbies = [...HOBBIES].sort(() => 0.5 - Math.random());
      userHobbies.push(...shuffledHobbies.slice(0, numHobbies));
    }

    const user: User = {
      id: i + 1,
      avatar: faker.image.avatar(),
      first_name: firstName,
      last_name: lastName,
      age: Math.floor(Math.random() * 82) + 18, // 18-99 years old
      nationality: NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)],
      hobbies: userHobbies,
    };

    data.push(user);
  }

  return data;
}

export function getTopHobbiesAndNationalities(data: User[]): {
  topHobbies: FilterItem[];
  topNationalities: FilterItem[];
} {
  // Count hobbies
  const hobbyCounts: Record<string, number> = {};
  const nationalityCounts: Record<string, number> = {};

  data.forEach((user) => {
    // Count hobbies
    user.hobbies.forEach((hobby) => {
      hobbyCounts[hobby] = (hobbyCounts[hobby] || 0) + 1;
    });

    // Count nationalities
    nationalityCounts[user.nationality] = (nationalityCounts[user.nationality] || 0) + 1;
  });

  // Get top 20 hobbies
  const topHobbies: FilterItem[] = Object.entries(hobbyCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([hobby, count]) => ({ hobby, count }));

  // Get top 20 nationalities
  const topNationalities: FilterItem[] = Object.entries(nationalityCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([nationality, count]) => ({ nationality, count }));

  return {
    topHobbies,
    topNationalities,
  };
}
