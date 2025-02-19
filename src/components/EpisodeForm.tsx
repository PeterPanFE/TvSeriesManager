import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import DatePicker from 'react-datepicker';
import { CREATE_EPISODE, UPDATE_EPISODE } from '../graphql/mutations';
import { EpisodeInput } from '../types';

interface EpisodeFormProps {
  episodeToEdit?: EpisodeInput;
  onClose: () => void;
  onEpisodeAdded: () => void;
}

const EpisodeForm: React.FC<EpisodeFormProps> = ({ episodeToEdit, onClose, onEpisodeAdded }) => {
  const [episode, setEpisode] = useState<EpisodeInput>({
    id: episodeToEdit?.id || Math.random().toString(),
    series: episodeToEdit?.series || '',
    title: episodeToEdit?.title || '',
    description: episodeToEdit?.description || '',
    seasonNumber: episodeToEdit?.seasonNumber || 1,
    episodeNumber: episodeToEdit?.episodeNumber || 1,
    releaseDate: episodeToEdit?.releaseDate || '',
    imdbId: episodeToEdit?.imdbId || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [createEpisode] = useMutation(CREATE_EPISODE, {
    onCompleted: () => {
      alert('Episode added successfully!');
      onEpisodeAdded();
      onClose();
    },
    onError: (error) => {
      alert('Failed to add episode: ' + error.message);
    },
  });

  const [updateEpisode] = useMutation(UPDATE_EPISODE);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEpisode({ ...episode, [name]: value });
    setErrors({ ...errors, [name]: value ? '' : 'This field is required' });
  };

  const handleDateChange = (date: Date | null) => {
    setEpisode({ ...episode, releaseDate: date ? date.toISOString().split('T')[0] : '' });
    setErrors({ ...errors, releaseDate: date ? '' : 'Release date is required' });
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(episode).forEach((key) => {
      if (!episode[key as keyof EpisodeInput]) {
        newErrors[key] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    if (episodeToEdit) {
      await updateEpisode({ variables: { episode } });
    } else {
      await createEpisode({ variables: { episode } });
    }
  };

  const isSubmitDisabled = Object.values(episode).some((value) => !value);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10">
      <div className="rounded-lg shadow-lg p-6 w-[30vw] min-w-[300px] min-h-[300px] bg-black">
        <h2 className="text-xl font-semibold mb-4">
          {episodeToEdit ? 'Edit Episode' : 'Create New Episode'}
        </h2>
        <form onSubmit={handleSubmit}>
          {['title', 'series', 'description', 'episodeNumber', 'seasonNumber', 'imdbId'].map((field) => (
            <label key={field} className="block mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
              <input
                type={field.includes('Number') ? 'number' : 'text'}
                name={field}
                value={episode[field as keyof EpisodeInput]}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </label>
          ))}
          <label className="block mb-2">
            Release Date:
            <DatePicker
              selected={episode.releaseDate ? new Date(episode.releaseDate) : null}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="block p-2 border rounded w-full"
              placeholderText="Select release date"
            />
            {errors.releaseDate && <p className="text-red-500 text-sm">{errors.releaseDate}</p>}
          </label>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
                type="submit"
                className={`px-4 py-2 rounded text-white ${isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                disabled={isSubmitDisabled}
                >
                {episodeToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EpisodeForm;
