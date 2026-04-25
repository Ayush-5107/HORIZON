export type Movie = {
  id: string
  title: string
  year: number
  rating: number // IMDb-style
  runtime: number // minutes
  genre: string
  genres: string[]
  synopsis: string
  posterQuery: string // for /placeholder.svg?query=
  socialProof: number // "X people liked this"
  director?: string
}

// Curated 15-movie pool — original/fictional titles to avoid licensing.
// Each query is tuned to render a distinctive, cinematic poster image.
export const MOVIES: Movie[] = [
  {
    id: "m01",
    title: "PIRATES OF THE CARIBBEAN: DEAD MEN TELL NO TALES",
    year: 2017,
    rating: 6.5,
    runtime: 129,
    genre: "Adventure",
    genres: ["Adventure", "Action", "Fantasy"],
    synopsis: "Captain Jack Sparrow faces deadly ghost sailors led by old rival Captain Salazar and races to find the Trident of Poseidon.",
    posterQuery: "https://image.tmdb.org/t/p/original/qwoGfcg6YUS55nUweKGujHE54Wy.jpg",
    socialProof: 52000,
    director: "Joachim Ronning",
  },
  {
    id: "m02",
    title: "INCEPTION",
    year: 2010,
    rating: 8.8,
    runtime: 148,
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Action", "Thriller"],
    synopsis: "A skilled extractor is offered a chance at redemption by planting an idea inside a target's subconscious.",
    posterQuery: "https://image.tmdb.org/t/p/original/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    socialProof: 98000,
    director: "Christopher Nolan",
  },
  {
    id: "m03",
    title: "MOANA",
    year: 2016,
    rating: 7.6,
    runtime: 107,
    genre: "Family",
    genres: ["Family", "Adventure", "Animation"],
    synopsis: "A fearless young wayfinder sails across the ocean with demigod Maui to save her people and discover her destiny.",
    posterQuery: "https://image.tmdb.org/t/p/original/4JeeleqJm8n2PFlMpgjHhQJxQxQ.jpg",
    socialProof: 86000,
    director: "Ron Clements",
  },
  {
    id: "m04",
    title: "DUNE: PART TWO",
    year: 2024,
    rating: 8.8,
    runtime: 166,
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Action", "Adventure"],
    synopsis: "Paul Atreides unites with Chani and the Fremen while facing imperial forces and a future only he can see.",
    posterQuery: "https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    socialProof: 90000,
    director: "Denis Villeneuve",
  },
  {
    id: "m05",
    title: "THE BOYS",
    year: 2019,
    rating: 8.7,
    runtime: 60,
    genre: "Action",
    genres: ["Action", "Comedy", "Crime"],
    synopsis: "A vigilante team fights corrupt superheroes who abuse their fame and powers.",
    posterQuery: "https://image.tmdb.org/t/p/original/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg",
    socialProof: 77000,
    director: "Eric Kripke",
  },
  {
    id: "m06",
    title: "THE DARK KNIGHT",
    year: 2008,
    rating: 9.0,
    runtime: 152,
    genre: "Action",
    genres: ["Action", "Crime", "Drama"],
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept a great test.",
    posterQuery: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800",
    socialProof: 120000,
    director: "Christopher Nolan",
  },
  {
    id: "m07",
    title: "INCEPTION",
    year: 2010,
    rating: 8.8,
    runtime: 148,
    genre: "Action",
    genres: ["Action", "Adventure", "Sci-Fi"],
    synopsis: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    posterQuery: "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80&w=800",
    socialProof: 95000,
    director: "Christopher Nolan",
  },
  {
    id: "m08",
    title: "PULP FICTION",
    year: 1994,
    rating: 8.9,
    runtime: 154,
    genre: "Crime",
    genres: ["Crime", "Drama"],
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine.",
    posterQuery: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=800",
    socialProof: 72000,
    director: "Quentin Tarantino",
  },
  {
    id: "m09",
    title: "MAD MAX: FURY ROAD",
    year: 2015,
    rating: 8.1,
    runtime: 120,
    genre: "Action",
    genres: ["Action", "Adventure", "Sci-Fi"],
    synopsis: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.",
    posterQuery: "https://images.unsplash.com/photo-1509316785289-025f5d846b35?auto=format&fit=crop&q=80&w=800",
    socialProof: 47000,
    director: "George Miller",
  },
  {
    id: "m10",
    title: "SPIDER-MAN: ACROSS THE SPIDER-VERSE",
    year: 2023,
    rating: 8.6,
    runtime: 140,
    genre: "Action",
    genres: ["Action", "Adventure", "Animation"],
    synopsis: "Miles Morales catapults across the Multiverse, encountering a team of Spider-People protecting its existence.",
    posterQuery: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=800",
    socialProof: 52000,
    director: "Joaquim Dos Santos",
  },
  {
    id: "m11",
    title: "THE SHINING",
    year: 1980,
    rating: 8.4,
    runtime: 146,
    genre: "Horror",
    genres: ["Horror", "Drama"],
    synopsis: "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.",
    posterQuery: "https://images.unsplash.com/photo-1495431039882-9447432296e3?auto=format&fit=crop&q=80&w=800",
    socialProof: 55000,
    director: "Stanley Kubrick",
  },
  {
    id: "m12",
    title: "EVERYTHING EVERYWHERE ALL AT ONCE",
    year: 2022,
    rating: 7.8,
    runtime: 139,
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Action", "Adventure"],
    synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence.",
    posterQuery: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=800",
    socialProof: 41000,
    director: "Daniel Kwan",
  },
  {
    id: "m13",
    title: "BLADE RUNNER 2049",
    year: 2017,
    rating: 8.0,
    runtime: 164,
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Action", "Drama"],
    synopsis: "A young Blade Runner discovers a long-buried secret and tracks down former Blade Runner Rick Deckard.",
    posterQuery: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&q=80&w=800",
    socialProof: 32000,
    director: "Denis Villeneuve",
  },
  {
    id: "m14",
    title: "ARRIVAL",
    year: 2016,
    rating: 7.9,
    runtime: 116,
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Drama", "Mystery"],
    synopsis: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear.",
    posterQuery: "https://images.unsplash.com/photo-1475130027491-4177259176bc?auto=format&fit=crop&q=80&w=800",
    socialProof: 29000,
    director: "Denis Villeneuve",
  },
  {
    id: "m15",
    title: "SPIRITED AWAY",
    year: 2001,
    rating: 8.6,
    runtime: 125,
    genre: "Adventure",
    genres: ["Adventure", "Animation", "Family"],
    synopsis: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods and spirits.",
    posterQuery: "https://images.unsplash.com/photo-1578632738980-4323633cebd2?auto=format&fit=crop&q=80&w=800",
    socialProof: 88000,
    director: "Hayao Miyazaki",
  },
  {
    id: "m16",
    title: "THE MATRIX",
    year: 1999,
    rating: 8.7,
    runtime: 136,
    genre: "Sci-Fi",
    genres: ["Sci-Fi", "Action"],
    synopsis: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    posterQuery: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    socialProof: 92000,
    director: "Lana Wachowski",
  },
  {
    id: "m17",
    title: "WHIPLASH",
    year: 2014,
    rating: 8.5,
    runtime: 107,
    genre: "Music",
    genres: ["Music", "Drama"],
    synopsis: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.",
    posterQuery: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    socialProof: 43000,
    director: "Damien Chazelle",
  },
  {
    id: "m18",
    title: "HER",
    year: 2013,
    rating: 8.0,
    runtime: 126,
    genre: "Romance",
    genres: ["Romance", "Sci-Fi", "Drama"],
    synopsis: "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.",
    posterQuery: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
    socialProof: 31000,
    director: "Spike Jonze",
  },
  {
    id: "m19",
    title: "GRAND BUDAPEST HOTEL",
    year: 2014,
    rating: 8.1,
    runtime: 99,
    genre: "Comedy",
    genres: ["Comedy", "Adventure", "Crime"],
    synopsis: "A writer encounters the owner of a decaying high-class hotel, who tells him of his early years as a lobby boy in the hotel's glorious years.",
    posterQuery: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800",
    socialProof: 54000,
    director: "Wes Anderson",
  },
  {
    id: "m20",
    title: "LA LA LAND",
    year: 2016,
    rating: 8.0,
    runtime: 128,
    genre: "Music",
    genres: ["Music", "Romance", "Comedy"],
    synopsis: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
    posterQuery: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800",
    socialProof: 61000,
    director: "Damien Chazelle",
  }
]

export const GENRE_COLORS: Record<string, string> = {
  "Sci-Fi": "oklch(0.85 0.2 200)", // Electric Cyan
  Thriller: "oklch(0.6 0.25 25)", // Intense Red
  Drama: "oklch(0.75 0.25 350)", // Vibrant Hot Pink
  Romance: "oklch(0.7 0.3 350)", // Pink/Magenta
  Comedy: "oklch(0.88 0.2 85)", // Bright Yellow
  Indie: "oklch(0.82 0.22 140)", // Neon Lime
  Action: "oklch(0.6 0.25 280)", // Deep Purple
  "Coming-of-Age": "oklch(0.78 0.2 150)", // Emerald Green
  Mystery: "oklch(0.12 0.01 20)", // Deep Charcoal
  Horror: "oklch(0.4 0.1 0)", // Dark Blood Red
  Folk: "oklch(0.6 0.15 60)", // Earthy Brown
  Documentary: "oklch(0.92 0.01 200)", // Soft Gray
  Adventure: "oklch(0.75 0.15 140)", // Forest Green
  Music: "oklch(0.65 0.25 320)", // Electric Purple
  Family: "oklch(0.95 0.15 90)", // Soft Yellow
  Crime: "oklch(0.2 0.05 0)", // Noir Black
}

export function getMovieById(id: string): Movie | undefined {
  return MOVIES.find((m) => m.id === id)
}
