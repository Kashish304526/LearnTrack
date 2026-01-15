import api from './api';

export type StudyItemType = 'task' | 'plan';

export interface StudyItem {
  id: number;
  title: string;
  description?: string;
  type: StudyItemType;
  completed: boolean;
}

// ----------------------
// GET ALL (tasks or plans)
// ----------------------
export const getStudyItems = (type: StudyItemType) =>
  api.get<StudyItem[]>(`/study-items?type=${type}`);

// ----------------------
// GET BY ID
// ----------------------
export const getStudyItemById = (id: number) =>
  api.get<StudyItem>(`/study-items/${id}`);

// ----------------------
// CREATE
// ----------------------
export const createStudyItem = (data: {
  title: string;
  description?: string;
  type: StudyItemType;
}) =>
  api.post<StudyItem>('/study-items', data);

// ----------------------
// UPDATE
// ----------------------
export const updateStudyItem = (
  id: number,
  data: { title?: string; description?: string }
) =>
  api.put<StudyItem>(`/study-items/${id}`, data);

// ----------------------
// COMPLETE (tasks only)
// ----------------------
export const completeStudyItem = (id: number) =>
  api.patch(`/study-items/${id}/complete`);

// ----------------------
// DELETE
// ----------------------
export const deleteStudyItem = (id: number) =>
  api.delete(`/study-items/${id}`);


export interface StudyItem {
  id: number;
  title: string;
  description?: string;
  type: StudyItemType;
  completed: boolean;
}