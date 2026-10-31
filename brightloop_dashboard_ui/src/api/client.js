const API_BASE = '/api';

export async function getSyllabusTree() {
  const res = await fetch(`${API_BASE}/syllabus/tree`);
  if (!res.ok) throw new Error('Failed to fetch syllabus tree');
  return res.json();
}

export async function getTopicDetail(topicId) {
  const res = await fetch(`${API_BASE}/syllabus/topics/${topicId}`);
  if (!res.ok) throw new Error('Failed to fetch topic details');
  return res.json();
}

export async function getSubjectStats(subjectId) {
  const res = await fetch(`${API_BASE}/syllabus/subjects/${subjectId}/stats`);
  if (!res.ok) throw new Error('Failed to fetch subject stats');
  return res.json();
}

export async function getResources({ topicId, bookmarkedOnly = false, type } = {}) {
  const params = new URLSearchParams();
  if (topicId) params.append('topic_id', topicId);
  if (bookmarkedOnly) params.append('bookmarked_only', 'true');
  if (type) params.append('resource_type', type);
  
  const res = await fetch(`${API_BASE}/resources?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

export async function createResource(formData) {
  const res = await fetch(`${API_BASE}/resources`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to create resource');
  }
  return res.json();
}

export async function toggleBookmark(resourceId) {
  const res = await fetch(`${API_BASE}/resources/${resourceId}/bookmark`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to update bookmark');
  return res.json();
}

export async function toggleVisibility(resourceId) {
  const res = await fetch(`${API_BASE}/resources/${resourceId}/visibility`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to update visibility');
  return res.json();
}

export async function deleteResource(resourceId) {
  const res = await fetch(`${API_BASE}/resources/${resourceId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete resource');
  return res.json();
}

export async function updateCoverage(topicId, coverageStatus, coverageEvidence = '') {
  const res = await fetch(`${API_BASE}/syllabus/topics/${topicId}/coverage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      coverage_status: coverageStatus,
      coverage_evidence: coverageEvidence,
    }),
  });
  if (!res.ok) throw new Error('Failed to update coverage');
  return res.json();
}

export async function searchEverything(query) {
  if (!query || !query.trim()) return [];
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query.trim())}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}
