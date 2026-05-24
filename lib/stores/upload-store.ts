import { create } from 'zustand';

export interface UploadProgress {
  id: string; // file id
  file: File;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  documentId?: string; // once created in DB
}

interface UploadStore {
  uploads: Record<string, UploadProgress>;
  startUpload: (id: string, file: File) => void;
  updateProgress: (id: string, progress: number) => void;
  completeUpload: (id: string, documentId: string) => void;
  failUpload: (id: string, error: string) => void;
  removeUpload: (id: string) => void;
  clearUploads: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: {},
  startUpload: (id, file) =>
    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: { id, file, progress: 0, status: 'uploading' },
      },
    })),
  updateProgress: (id, progress) =>
    set((state) => {
      const upload = state.uploads[id];
      if (!upload) return state;
      return {
        uploads: {
          ...state.uploads,
          [id]: { ...upload, progress },
        },
      };
    }),
  completeUpload: (id, documentId) =>
    set((state) => {
      const upload = state.uploads[id];
      if (!upload) return state;
      return {
        uploads: {
          ...state.uploads,
          [id]: { ...upload, progress: 100, status: 'completed', documentId },
        },
      };
    }),
  failUpload: (id, error) =>
    set((state) => {
      const upload = state.uploads[id];
      if (!upload) return state;
      return {
        uploads: {
          ...state.uploads,
          [id]: { ...upload, status: 'error', error },
        },
      };
    }),
  removeUpload: (id) =>
    set((state) => {
      const newUploads = { ...state.uploads };
      delete newUploads[id];
      return { uploads: newUploads };
    }),
  clearUploads: () => set({ uploads: {} }),
}));
