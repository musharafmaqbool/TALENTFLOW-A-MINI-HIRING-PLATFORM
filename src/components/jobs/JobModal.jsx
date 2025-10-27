import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { X } from 'lucide-react';

export function JobModal({ isOpen, onClose, onSubmit, job, existingSlugs }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    status: 'draft',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        slug: job.slug,
        description: job.description,
        status: job.status,
        tags: job.tags,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        description: '',
        status: 'draft',
        tags: [],
      });
    }
    setErrors({});
  }, [job, isOpen]);

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (existingSlugs.includes(formData.slug) && formData.slug !== job?.slug) {
      newErrors.slug = 'Slug must be unique';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Job submission error:', error);
      
      // Check for specific error types
      if (error.message.includes('unique') || error.message.includes('Slug')) {
        setErrors({ slug: 'This slug is already in use. Please choose a different one.' });
      } else if (error.status === 404 || error.message.includes('Not Found')) {
        setErrors({ general: 'API endpoint not found. Please refresh the page and try again.' });
      } else if (error.status === 500 || error.message.includes('Server Error')) {
        setErrors({ general: 'Server error. Please try again.' });
      } else {
        setErrors({ general: error.message || 'Failed to save job. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={job ? 'Edit Job' : 'Create New Job'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.general}
          </div>
        )}

        <Input
          label="Job Title *"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          error={errors.title}
          placeholder="e.g., Senior Frontend Developer"
        />

        <Input
          label="Slug *"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
          error={errors.slug}
          placeholder="e.g., senior-frontend-developer"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Job description..."
          />
        </div>

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived' },
          ]}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add a tag..."
            />
            <Button type="button" onClick={handleAddTag} variant="secondary">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-primary-900"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

