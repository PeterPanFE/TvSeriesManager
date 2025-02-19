import { gql } from '@apollo/client';

export const LIST_EPISODES = gql`
  query ListEpisodes($search: String) {
    listEpisodes(search: $search) {
      id
      title
      series
      seasonNumber
      episodeNumber
      releaseDate
      imdbId
    }
  }
`;

export const GET_EPISODE_BY_ID = gql`
  query GetEpisodeById($episodeId: String!) {
    getEpisodeById(episodeId: $episodeId) {
      id
      series
      title
      description
      seasonNumber
      episodeNumber
      releaseDate
      imdbId
    }
  }
`;
