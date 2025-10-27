import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { SectionBuilder } from './SectionBuilder';
import { AssessmentPreview } from './AssessmentPreview';
import { api, ApiError } from '@/utils/api';
import { db } from '@/db';

export function AssessmentBuilder() {
  const { id, jobId } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    if (id) {
      loadAssessment();
    } else if (jobId) {
      loadJobTitle();
      initializeNewAssessment();
    }
  }, [id, jobId]);

  const loadJobTitle = async () => {
    if (!jobId) return;
    try {
      const job = await db.jobs.get(jobId);
      if (job) {
        setJobTitle(job.title);
      }
    } catch (err) {
      console.error('Failed to load job:', err);
    }
  };

  const loadAssessment = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const data = await api.getAssessment(id);
      setAssessment(data);
      setTitle(data.title);
      setDescription(data.description || '');
      setSections(data.sections);

      // Load job title
      const job = await db.jobs.get(data.jobId);
      if (job) setJobTitle(job.title);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeNewAssessment = () => {
    setSections([
      {
        id: `section-${Date.now()}`,
        title: 'Section 1',
        description: '',
        order: 0,
        questions: [],
      },
    ]);
  };

  const handleAddSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      description: '',
      order: sections.length,
      questions: [],
    };
    setSections([...sections, newSection]);
  };

  const handleUpdateSection = (sectionId, updates) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, ...updates } : s));
  };

  const handleDeleteSection = (sectionId) => {
    setSections(sections.filter(s => s.id !== sectionId).map((s, index) => ({ ...s, order: index })));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const assessmentData = {
        jobId: jobId || assessment?.jobId,
        title,
        description,
        sections,
      };

      if (id) {
        await api.updateAssessment(id, assessmentData);
      } else {
        await api.createAssessment(assessmentData);
      }

      // Redirect or show success
      window.history.back();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save assessment');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Link to="/assessments" className="inline-flex items-center text-primary-600 hover:text-primary-700">
        <ArrowLeft size={20} className="mr-2" />
        Back to Assessments
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Edit Assessment' : 'Create Assessment'}
          </h1>
          {jobTitle && (
            <p className="text-gray-600 mt-1">For: {jobTitle}</p>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save size={20} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Assessment'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Details</h2>
            <div className="space-y-4">
              <Input
                label="Title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Frontend Developer Assessment"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Assessment description..."
                />
              </div>
            </div>
          </div>

          {sections.map((section) => (
            <SectionBuilder
              key={section.id}
              section={section}
              onUpdate={(updates) => handleUpdateSection(section.id, updates)}
              onDelete={() => handleDeleteSection(section.id)}
            />
          ))}

          <Button variant="secondary" onClick={handleAddSection} className="w-full">
            <Plus size={20} className="mr-2" />
            Add Section
          </Button>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:sticky lg:top-6 lg:self-start">
            <AssessmentPreview
              title={title || 'Untitled Assessment'}
              description={description}
              sections={sections}
            />
          </div>
        )}
      </div>
    </div>
  );
}

