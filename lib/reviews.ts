export type Review = {
  id: string
  movieId: string
  author: string
  avatar: string // initials
  rating: number
  body: string
  likes: number
}

// 2–3 reviews per movie. Tone is varied: enthusiastic, critical, observational.
export const REVIEWS: Review[] = [
  // Neon Cathedral
  { id: "r-m01-1", movieId: "m01", author: "Mira K.", avatar: "MK", rating: 9, likes: 421, body: "The city is the protagonist. I forgot I was watching a movie and started taking notes on the architecture." },
  { id: "r-m01-2", movieId: "m01", author: "Devon R.", avatar: "DR", rating: 7, likes: 88, body: "Stunning to look at, but the third act asks a lot of patience. Worth it for the rooftop scene alone." },
  { id: "r-m01-3", movieId: "m01", author: "Anya S.", avatar: "AS", rating: 10, likes: 1_204, body: "I have not been this hypnotized by neon since Blade Runner. Watch it loud and watch it late." },

  // The Salt Hour
  { id: "r-m02-1", movieId: "m02", author: "Hassan B.", avatar: "HB", rating: 8, likes: 233, body: "Two people, one carriage, no filler. It is a play disguised as a film and I am here for it." },
  { id: "r-m02-2", movieId: "m02", author: "June L.", avatar: "JL", rating: 7, likes: 102, body: "Quiet, careful, slightly too in love with its own dialogue. Cried twice anyway." },

  // Wolves of the Quiet Coast
  { id: "r-m03-1", movieId: "m03", author: "Iris T.", avatar: "IT", rating: 9, likes: 612, body: "A small-town mystery that earns every silence. The fog is acting harder than most leads this year." },
  { id: "r-m03-2", movieId: "m03", author: "Carlos M.", avatar: "CM", rating: 8, likes: 199, body: "Slow-burn done right. By minute 90 I was holding my breath without noticing." },
  { id: "r-m03-3", movieId: "m03", author: "Petra Z.", avatar: "PZ", rating: 6, likes: 47, body: "Beautiful but I called the twist around minute 40. Still, the lead performance is incredible." },

  // Paper Moon Diner
  { id: "r-m04-1", movieId: "m04", author: "Tomás G.", avatar: "TG", rating: 8, likes: 144, body: "A hangout movie with a heart of pancakes. I want to live in this diner." },
  { id: "r-m04-2", movieId: "m04", author: "Naomi P.", avatar: "NP", rating: 7, likes: 71, body: "Charming and small-scale. Perfect for a low-energy night with friends." },

  // Iron Lullaby
  { id: "r-m05-1", movieId: "m05", author: "Rafael O.", avatar: "RO", rating: 10, likes: 2_010, body: "It is rare for a blockbuster to also be a poem. The desert sequence will be studied." },
  { id: "r-m05-2", movieId: "m05", author: "Wen Y.", avatar: "WY", rating: 8, likes: 488, body: "Massive in every direction. A little long, but I would not cut a frame of the third act." },
  { id: "r-m05-3", movieId: "m05", author: "Greta H.", avatar: "GH", rating: 9, likes: 906, body: "Action movies rarely make me feel grief. This one did, twice." },

  // How to Disappear
  { id: "r-m06-1", movieId: "m06", author: "Ada F.", avatar: "AF", rating: 8, likes: 154, body: "A road trip movie that respects its main character enough to let her be wrong sometimes." },
  { id: "r-m06-2", movieId: "m06", author: "Kojo D.", avatar: "KD", rating: 7, likes: 62, body: "Sweet, occasionally syrupy, but the soundtrack is genuinely excellent." },

  // The Cartographer
  { id: "r-m07-1", movieId: "m07", author: "Linnea V.", avatar: "LV", rating: 10, likes: 1_589, body: "The most beautiful film I have seen this year. Every frame is a map of a feeling." },
  { id: "r-m07-2", movieId: "m07", author: "Bashir Q.", avatar: "BQ", rating: 9, likes: 622, body: "If you liked Arrival, this is your next obsession. Bring a notebook." },

  // Vespertine
  { id: "r-m08-1", movieId: "m08", author: "Sora I.", avatar: "SI", rating: 8, likes: 318, body: "A romance built around a clock and somehow the clock is the most romantic thing in it." },
  { id: "r-m08-2", movieId: "m08", author: "Eli W.", avatar: "EW", rating: 7, likes: 91, body: "Gorgeous, a little precious. The score does most of the heavy lifting and that is fine." },

  // Hollow Bones
  { id: "r-m09-1", movieId: "m09", author: "Maeve C.", avatar: "MC", rating: 8, likes: 401, body: "Folk horror that respects its myth. I will not be googling birds for a week." },
  { id: "r-m09-2", movieId: "m09", author: "Jonas K.", avatar: "JK", rating: 9, likes: 712, body: "Atmospheric, restrained, and absolutely terrifying in its final ten minutes." },

  // Slow Light
  { id: "r-m10-1", movieId: "m10", author: "Priya N.", avatar: "PN", rating: 9, likes: 833, body: "Hard sci-fi with a beating human heart. The final shot recontextualized the whole film for me." },
  { id: "r-m10-2", movieId: "m10", author: "Dmitri S.", avatar: "DS", rating: 8, likes: 277, body: "Ambitious in scope, intimate in scale. A rare combo." },
  { id: "r-m10-3", movieId: "m10", author: "Hala B.", avatar: "HB", rating: 7, likes: 109, body: "Slower than its title suggests. Worth it, but bring caffeine." },

  // The Understudy
  { id: "r-m11-1", movieId: "m11", author: "Cleo R.", avatar: "CR", rating: 8, likes: 256, body: "A clever conceit executed with real craft. The lead is going to be huge." },
  { id: "r-m11-2", movieId: "m11", author: "Marcus T.", avatar: "MT", rating: 7, likes: 84, body: "Slick, well-shot, occasionally too pleased with itself. Still recommended." },

  // Fieldnotes from the Eclipse
  { id: "r-m12-1", movieId: "m12", author: "Yuki A.", avatar: "YA", rating: 8, likes: 173, body: "A documentary that turns into a ghost story without ever raising its voice. Remarkable." },
  { id: "r-m12-2", movieId: "m12", author: "Sam P.", avatar: "SP", rating: 7, likes: 58, body: "Beautifully shot. The mystery angle is more suggestion than payoff, but I was happy to sit with it." },

  // Glasshouse Symphony
  { id: "r-m13-1", movieId: "m13", author: "Olu A.", avatar: "OA", rating: 8, likes: 211, body: "I wish I could play this film through speakers in my own apartment. The sound design is the lead." },
  { id: "r-m13-2", movieId: "m13", author: "Beatriz N.", avatar: "BN", rating: 7, likes: 76, body: "Light on plot, heavy on mood. A spa day for your eyes and ears." },

  // After the Comet
  { id: "r-m14-1", movieId: "m14", author: "Theo M.", avatar: "TM", rating: 9, likes: 644, body: "Coming of age plus end of the world. It should not work, and it absolutely does." },
  { id: "r-m14-2", movieId: "m14", author: "Rin S.", avatar: "RS", rating: 8, likes: 295, body: "Stranger Things grown up and sent to therapy. I mean that as a compliment." },

  // Lemon Tree Country
  { id: "r-m15-1", movieId: "m15", author: "Pia C.", avatar: "PC", rating: 8, likes: 137, body: "A warm, sun-bleached comedy about siblings who are bad at being siblings. Hugely charming." },
  { id: "r-m15-2", movieId: "m15", author: "Andre F.", avatar: "AF", rating: 7, likes: 64, body: "Predictable but in the way a good lemon is predictable. Sometimes you want exactly this." },
]

export function reviewsForMovie(movieId: string): Review[] {
  return REVIEWS.filter((r) => r.movieId === movieId)
}
