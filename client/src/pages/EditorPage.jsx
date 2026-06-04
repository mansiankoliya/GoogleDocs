import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { Save, Share2, ChevronLeft, CheckCircle2 } from 'lucide-react';

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [shareUsername, setShareUsername] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchDoc();
  }, [id]);

  const fetchDoc = async () => {
    try {
      const res = await api.get(`/documents/${id}`);
      setTitle(res.data.title);
      setContent(res.data.content);
      setIsOwner(res.data.owner._id === user?.id || res.data.owner === user?.id);
    } catch (err) {
      alert('Failed to load document');
      navigate('/');
    }
  };

  const saveDocument = async (newTitle, newContent) => {
    try {
      setSaveStatus('Saving...');
      await api.put(`/documents/${id}`, { title: newTitle, content: newContent });
      setSaveStatus('Saved');
    } catch (err) {
      setSaveStatus('Error saving');
    }
  };

  const handleContentChange = (value) => {
    setContent(value);
    setSaveStatus('Unsaved changes');
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveDocument(title, value);
    }, 1500);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSaveStatus('Unsaved changes');
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      saveDocument(newTitle, content);
    }, 1500);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/documents/${id}/share`, { username: shareUsername });
      alert(`Successfully shared with ${shareUsername}`);
      setShowShareModal(false);
      setShareUsername('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to share document');
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['clean']
    ],
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
            <ChevronLeft size={24} />
          </button>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-2xl font-bold bg-transparent border-none focus:ring-2 focus:ring-blue-100 rounded px-2 py-1 w-full max-w-lg transition"
            placeholder="Untitled Document"
          />
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {saveStatus === 'Saved' ? <CheckCircle2 size={16} className="text-green-500" /> : <Save size={16} />}
            {saveStatus}
          </div>
          
          {isOwner && (
            <button 
              onClick={() => setShowShareModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition shadow-sm"
            >
              <Share2 size={18} /> Share
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
        <div className="bg-white shadow-xl max-w-4xl w-full border border-gray-200 min-h-[800px]">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={handleContentChange} 
            modules={modules}
            className="h-full border-none [&_.ql-container]:text-lg [&_.ql-editor]:min-h-[750px] [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:bg-gray-50 [&_.ql-editor]:p-8"
          />
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-2">Share Document</h3>
            <p className="text-gray-500 mb-6">Give another user access to edit this document.</p>
            
            <form onSubmit={handleShare}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">User's Name (e.g., Mansi, Rahul)</label>
                <input
                  type="text"
                  value={shareUsername}
                  onChange={(e) => setShareUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowShareModal(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg transition">Share Access</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
