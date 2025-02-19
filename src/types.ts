// src/types.ts
export interface Episode {
    id: string;
    title: string;
    series: string;
    description: string;
    seasonNumber: number;
    episodeNumber: number;
    releaseDate: string;
    imdbId: string;
  }
  
  export interface EpisodeInput {
    id: string;
    title: string;
    series: string;
    description: string;
    seasonNumber: number;
    episodeNumber: number;
    releaseDate: string;
    imdbId: string;
  }
  