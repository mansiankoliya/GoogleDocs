import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDocuments } from '../hooks/useDocuments';
import { useAuth } from '../hooks/useAuth';
import { Plus, Upload, FileText, Share2, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { ownedDocs, sharedDocs, loading, fetchDocuments, createDocument, uploadDocument } = useDocuments();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleCreate = async () => {
    try {
      const doc = await createDocument();
      navigate(`/d/${doc._id}`);
    } catch (err) {
      alert('Error creating document');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const doc = await uploadDocument(file);
      navigate(`/d/${doc._id}`);
    } catch (err) {
      alert('Error uploading file. Make sure it is .txt or .md');
    }
  };

  const renderDocs = (docs, icon, emptyMsg) => {
    if (loading) return <div className="animate-pulse flex space-x-4"><div className="h-20 bg-gray-200 rounded w-full"></div></div>;
    if (docs.length === 0) return <p className="text-gray-500 italic py-4">{emptyMsg}</p>;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map(doc => (
          <Link key={doc._id} to={`/d/${doc._id}`} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition group cursor-pointer block">
            <div className="flex items-center gap-3 mb-3 text-gray-700 group-hover:text-blue-600">
              {icon}
              <h3 className="font-semibold text-lg truncate">{doc.title}</h3>
            </div>
            <p className="text-sm text-gray-400">Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-blue-600" /> Docs Clone
          </h1>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-600 border-r pr-4">Hello, {user?.username}</span>
            <button onClick={logout} className="text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <button onClick={handleCreate} className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm flex justify-center items-center gap-2">
            <Plus size={20} /> Create Blank Document
          </button>
          
          <label className="flex-1 sm:flex-none bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border hover:bg-gray-50 transition shadow-sm flex justify-center items-center gap-2 cursor-pointer">
            <Upload size={20} /> Upload .txt / .md
            <input type="file" className="hidden" accept=".txt,.md" onChange={handleUpload} />
          </label>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="text-gray-500" /> Owned Documents
          </h2>
          {renderDocs(ownedDocs, <FileText className="text-blue-500" />, "You haven't created any documents yet.")}
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Share2 className="text-gray-500" /> Shared with Me
          </h2>
          {renderDocs(sharedDocs, <Share2 className="text-green-500" />, "No documents have been shared with you.")}
        </section>
      </main>
    </div>
  );
}
