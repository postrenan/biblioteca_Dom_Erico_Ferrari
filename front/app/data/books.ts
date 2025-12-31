export interface Book {
  id: number;
  title: string;
  description: string;
  image: string;
  available: number;
  genre: 'Ficção Científica' | 'Fantasia' | 'Literatura Brasileira' | 'História';
}

export const allBooks: Book[] = [
  // Ficção Científica
  {
    id: 1,
    title: 'Duna',
    description: 'A jornada de Paul Atreides em um planeta deserto perigoso.',
    image: 'https://placehold.co/300x450/222/FFF?text=Duna',
    available: 5,
    genre: 'Ficção Científica',
  },
  {
    id: 2,
    title: 'Neuromancer',
    description: 'Um cowboy do ciberespaço em uma última missão perigosa.',
    image: 'https://placehold.co/300x450/222/FFF?text=Neuromancer',
    available: 3,
    genre: 'Ficção Científica',
  },
  {
    id: 3,
    title: 'O Guia do Mochileiro das Galáxias',
    description: 'As aventuras intergalácticas de Arthur Dent após a destruição da Terra.',
    image: 'https://placehold.co/300x450/222/FFF?text=Guia+do+Mochileiro',
    available: 8,
    genre: 'Ficção Científica',
  },

  // Fantasia
  {
    id: 4,
    title: 'O Senhor dos Anéis',
    description: 'A jornada para destruir o Um Anel e derrotar o Senhor do Escuro.',
    image: 'https://placehold.co/300x450/333/FFF?text=Senhor+dos+Anéis',
    available: 2,
    genre: 'Fantasia',
  },
  {
    id: 5,
    title: 'Harry Potter e a Pedra Filosofal',
    description: 'O início da jornada de um jovem bruxo na Escola de Magia e Bruxaria de Hogwarts.',
    image: 'https://placehold.co/300x450/333/FFF?text=Harry+Potter',
    available: 10,
    genre: 'Fantasia',
  },
  {
    id: 6,
    title: 'O Nome do Vento',
    description: 'A história de Kvothe, um aventureiro e músico de renome.',
    image: 'https://placehold.co/300x450/333/FFF?text=O+Nome+do+Vento',
    available: 0,
    genre: 'Fantasia',
  },

  // Literatura Brasileira
  {
    id: 7,
    title: 'Dom Casmurro',
    description: 'Bentinho narra sua história de amor e ciúmes com a enigmática Capitu.',
    image: 'https://placehold.co/300x450/444/FFF?text=Dom+Casmurro',
    available: 12,
    genre: 'Literatura Brasileira',
  },
  {
    id: 8,
    title: 'Grande Sertão: Veredas',
    description: 'A saga do jagunço Riobaldo pelo sertão mineiro.',
    image: 'https://placehold.co/300x450/444/FFF?text=Grande+Sertão',
    available: 4,
    genre: 'Literatura Brasileira',
  },

  // História
  {
    id: 9,
    title: '1808',
    description: 'Como a corte portuguesa enganou Napoleão e mudou a história do Brasil.',
    image: 'https://placehold.co/300x450/555/FFF?text=1808',
    available: 6,
    genre: 'História',
  },
  {
    id: 10,
    title: 'Sapiens: Uma Breve História da Humanidade',
    description: 'Uma análise da jornada da nossa espécie desde a Idade da Pedra.',
    image: 'https://placehold.co/300x450/555/FFF?text=Sapiens',
    available: 3,
    genre: 'História',
  }
];