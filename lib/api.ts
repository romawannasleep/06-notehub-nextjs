import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Note, NewNoteData } from '../../types/note';

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  page?: number;
  perPage?: number;
  totalPages: number;
}

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get('/notes', { params });
  return response.data;
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post('/notes', noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return response.data;
};

export const fetchNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return response.data;
};

// alias for backward/explicit naming
export const fetchNoteById = fetchNote;