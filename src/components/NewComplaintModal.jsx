import React, { useState } from 'react';

const NewComplaintModal = ({ open, onClose, onSubmit }) => {
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState('Medium');

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">New Complaint</h3>

        <textarea
          className="w-full border rounded p-2 mb-3"
          placeholder="Describe the issue..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />

        <select
          className="w-full border rounded p-2 mb-4"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
  onClick={() => {
    console.log('SUBMIT CLICKED');
    console.log('Issue:', issue);
    console.log('Priority:', priority);
    onSubmit({ issue, priority });
  }}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Submit
</button>

        </div>
      </div>
    </div>
  );
};

export default NewComplaintModal;
