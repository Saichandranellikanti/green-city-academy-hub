
export const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Sustainable Urban Planning',
    description: 'Learn the foundational concepts of planning sustainable cities that reduce carbon footprint while improving quality of life.',
    thumbnail: 'https://images.unsplash.com/photo-1518494679888-7ffaf6eef303',
    duration: '4 weeks',
    lessonCount: 12,
    progressPercent: 75,
    syllabus: [
      {
        title: 'Understanding Urban Sustainability',
        isCompleted: true,
        lessons: [
          { id: '1-1', title: 'What Makes a City Sustainable?', isCompleted: true, duration: '15 min' },
          { id: '1-2', title: 'History of Urban Planning', isCompleted: true, duration: '20 min' },
          { id: '1-3', title: 'Key Metrics and Goals', isCompleted: true, duration: '25 min' }
        ]
      },
      {
        title: 'Green Infrastructure',
        isCompleted: true,
        lessons: [
          { id: '1-4', title: 'Urban Forests and Green Spaces', isCompleted: true, duration: '30 min' },
          { id: '1-5', title: 'Water Management Systems', isCompleted: true, duration: '25 min' },
          { id: '1-6', title: 'Biodiversity in Cities', isCompleted: false, duration: '20 min' }
        ]
      },
      {
        title: 'Sustainable Transportation',
        isCompleted: false,
        lessons: [
          { id: '1-7', title: 'Public Transit Planning', isCompleted: true, duration: '25 min' },
          { id: '1-8', title: 'Bicycle Infrastructure', isCompleted: true, duration: '15 min' },
          { id: '1-9', title: 'Walkable Cities Design', isCompleted: false, duration: '20 min' }
        ]
      },
      {
        title: 'Urban Energy Systems',
        isCompleted: false,
        lessons: [
          { id: '1-10', title: 'Renewable Energy Integration', isCompleted: false, duration: '30 min' },
          { id: '1-11', title: 'District Heating and Cooling', isCompleted: false, duration: '25 min' },
          { id: '1-12', title: 'Smart Grids for Cities', isCompleted: false, duration: '35 min' }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Green Building Design and Technology',
    description: 'Explore cutting-edge approaches to designing buildings that minimize environmental impact and maximize energy efficiency.',
    thumbnail: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    duration: '6 weeks',
    lessonCount: 18,
    progressPercent: 25,
  },
  {
    id: '3',
    title: 'Urban Agriculture and Food Systems',
    description: 'Learn how cities can produce food locally, reduce food miles, and create more resilient local food economies.',
    thumbnail: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8',
    duration: '3 weeks',
    lessonCount: 9,
    progressPercent: 0,
  },
  {
    id: '4',
    title: 'Smart Cities and IoT',
    description: 'Discover how Internet of Things technologies can make urban systems more efficient, responsive, and sustainable.',
    thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095',
    duration: '5 weeks',
    lessonCount: 15,
    progressPercent: 0,
  },
  {
    id: '5',
    title: 'Climate Resilient Urban Design',
    description: 'Learn strategies to design cities that can withstand and adapt to climate change impacts like flooding, heat waves, and extreme weather.',
    thumbnail: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b',
    duration: '4 weeks',
    lessonCount: 12,
    progressPercent: 0,
  },
  {
    id: '6',
    title: 'Circular Economy in Cities',
    description: 'Explore how cities can reduce waste, reuse resources, and create closed-loop systems for materials and energy.',
    thumbnail: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51',
    duration: '3 weeks',
    lessonCount: 9,
    progressPercent: 0,
  }
];

export const mockLeaderboard = [
  {
    id: 'user-1',
    rank: 1,
    name: 'Emma Rodriguez',
    region: 'North America',
    country: 'United States',
    points: 1250,
    completedCourses: 8
  },
  {
    id: 'user-2',
    rank: 2,
    name: 'Liu Wei',
    region: 'Asia',
    country: 'China',
    points: 1180,
    completedCourses: 7
  },
  {
    id: 'user-3',
    rank: 3,
    name: 'Ahmed Hassan',
    region: 'Middle East',
    country: 'UAE',
    points: 1030,
    completedCourses: 6
  },
  {
    id: 'user-4',
    rank: 4,
    name: 'Anna Schmidt',
    region: 'Europe',
    country: 'Germany',
    points: 985,
    completedCourses: 6
  },
  {
    id: 'user-5',
    rank: 5,
    name: 'Carlos Mendoza',
    region: 'Latin America',
    country: 'Mexico',
    points: 920,
    completedCourses: 5
  },
  {
    id: 'user-6',
    rank: 6,
    name: 'Sarah Johnson',
    region: 'North America',
    country: 'Canada',
    points: 875,
    completedCourses: 5
  },
  {
    id: 'user-7',
    rank: 7,
    name: 'Priya Patel',
    region: 'Asia',
    country: 'India',
    points: 830,
    completedCourses: 4
  },
  {
    id: 'user-8',
    rank: 8,
    name: 'Oluwaseun Adeyemi',
    region: 'Africa',
    country: 'Nigeria',
    points: 785,
    completedCourses: 4
  },
  {
    id: 'user-9',
    rank: 9,
    name: 'Elena Vasiliev',
    region: 'Europe',
    country: 'Russia',
    points: 740,
    completedCourses: 4
  },
  {
    id: 'user-10',
    rank: 10,
    name: 'Jamal Wilson',
    region: 'North America',
    country: 'United States',
    points: 695,
    completedCourses: 3
  }
];

export const regionRankings = [
  { region: 'North America', participants: 1250, completedCourses: 4300, avgPoints: 620 },
  { region: 'Europe', participants: 1050, completedCourses: 3700, avgPoints: 580 },
  { region: 'Asia', participants: 1450, completedCourses: 4800, avgPoints: 540 },
  { region: 'Latin America', participants: 750, completedCourses: 2200, avgPoints: 510 },
  { region: 'Africa', participants: 650, completedCourses: 1800, avgPoints: 480 },
  { region: 'Middle East', participants: 520, completedCourses: 1500, avgPoints: 470 },
  { region: 'Oceania', participants: 320, completedCourses: 950, avgPoints: 460 }
];
