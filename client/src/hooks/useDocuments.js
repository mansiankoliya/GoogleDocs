import { useState, useCallback } from 'react';
import api from '../api/axios';

export const useDocuments = () => {
  const [ownedDocs, setOwnedDocs] = useState([]);
  const [sharedDocs, setSharedDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents');
      setOwnedDocs(res.data.owned);
      setSharedDocs(res.data.shared);
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createDocument = async () => {
    const res = await api.post('/documents', { title: 'Untitled Document' });
    return res.data;
  };

  const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  };

  return { ownedDocs, sharedDocs, loading, fetchDocuments, createDocument, uploadDocument };
};
