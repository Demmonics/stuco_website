export interface Dignitary {
  name: string;
  role: string;
  affiliation?: string;
  era?: string;
  quote?: string;
  notable?: string;
}

export const DIGNITARIES: Dignitary[] = [
  {
    name: "Dr. A. P. J. Abdul Kalam",
    role: "Former President of India",
    affiliation: "Renowned Aerospace Scientist & Missile Pioneer",
    notable: "11th President of India, Bharat Ratna",
  },
  {
    name: "His Holiness the 14th Dalai Lama",
    role: "Spiritual Leader & Nobel Peace Laureate",
    affiliation: "Global Ambassador of Peace & Human Values",
    notable: "Nobel Peace Prize Laureate",
  },
  {
    name: "Dr. Raghuram Rajan",
    role: "Former Governor, Reserve Bank of India",
    affiliation: "Distinguished Service Professor of Finance, Chicago Booth",
    notable: "23rd Governor of the RBI",
  },
  {
    name: "A. S. Kiran Kumar",
    role: "Former Chairman, ISRO",
    affiliation: "Secretary, Department of Space",
    notable: "Key Architect of Mars Orbiter Mission (Mangalyaan) & Chandrayaan-1",
  },
  {
    name: "Dr. R. Chidambaram",
    role: "Former Principal Scientific Adviser to the Govt. of India",
    affiliation: "Former Chairman, Atomic Energy Commission (AEC)",
    notable: "Key Figure in Pokhran-II Tests, DAE",
  },
  {
    name: "Dr. Jayant Narlikar",
    role: "Eminent Astrophysicist & Cosmologist",
    affiliation: "Founder Director, IUCAA",
    notable: "Hoyle-Narlikar Theory of Gravity, Padma Vibhushan",
  },
  {
    name: "Prof. Arogyaswami Paulraj",
    role: "Professor Emeritus, Stanford University",
    affiliation: "Inventor of MIMO Wireless Communication",
    notable: "Marconi Prize Laureate, Pioneer of 4G/5G/Wi-Fi",
  },
  {
    name: "Sandeep Jain",
    role: "Founder & CEO, GeeksforGeeks",
    affiliation: "Pioneer in Technical Education & Competitive Programming",
    notable: "Educated millions of software engineers globally",
  },
  {
    name: "Rohit Suri",
    role: "President & Managing Director",
    affiliation: "Jaguar Land Rover India",
    notable: "Automotive Industry Leader",
  },
  {
    name: "Ustad Zakir Hussain",
    role: "Legendary Tabla Maestro & Composer",
    affiliation: "Global Icon of Classical Indian Music",
    notable: "Grammy Award Winner, Padma Vibhushan",
  },
  {
    name: "Rajkumar Hirani",
    role: "Celebrated Film Director & Screenwriter",
    affiliation: "Indian Cinema",
    notable: "Director of 3 Idiots, PK, Munna Bhai",
  },
  {
    name: "Stephen Fleming",
    role: "Former New Zealand Cricket Captain",
    affiliation: "Head Coach, Chennai Super Kings",
    notable: "Legendary International Cricket Strategist",
  },
  {
    name: "Prithviraj Chavan",
    role: "Former Chief Minister of Maharashtra",
    affiliation: "Former Union Minister of State for Science & Technology",
    notable: "BITS Pilani & UC Berkeley Engineer-Statesman",
  },
  {
    name: "Dr. Harsh Vardhan",
    role: "Former Union Minister of Science & Technology and Health",
    affiliation: "Government of India",
    notable: "Pioneered Polio Eradication Campaign",
  },
  {
    name: "Dr. Subramanian Swamy",
    role: "Economist, Author & Former Union Cabinet Minister",
    affiliation: "Former Member of Parliament, Rajya Sabha",
    notable: "Professor of Economics, Harvard University",
  }
];
