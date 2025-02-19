import { gql } from '@apollo/client';

export const CREATE_EPISODE = gql`
  mutation CreateEpisode($episode: EpisodeInput!) {
    createEpisode(episode: $episode) {
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

export const DELETE_EPISODE = gql`
  mutation DeleteEpisode($episodeId: String!) {
    deleteEpisode(episodeId: $episodeId)
  }
`;

export const UPDATE_EPISODE = gql`
  mutation UpdateEpisode($episode: UpdateEpisodeInput!) {
    updateEpisode(episode: $episode) {
      id
      title
      series
      description
      seasonNumber
      episodeNumber
      releaseDate
      imdbId
    }
  }
`;
