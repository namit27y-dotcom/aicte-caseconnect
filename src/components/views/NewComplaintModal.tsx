import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Institution, ComplaintCategory, ComplaintPriority, Complaint } from '../../types';
import { SYNTHETIC_INSTITUTIONS } from '../../data/syntheticData';

interface NewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newComplaint: Partial<Complaint>) => void;
}

export const NewComplaintModal: React.FC<NewComplaintModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [institutionId, setInstitutionId] = useState(SYNTHETIC_INSTITUTIONS[0]?.id || '');
  const [category, setCategory] = useState<ComplaintCategory>('ADMISSION_FRAUD');
  const [priority, setPriority] = useState<ComplaintPriority>('HIGH');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complainantName, setComplainantName] = useState('');
  const [complainantType, setComplainantType] = useState<'STUDENT' | 'FACULTY' | 'PARENT' | 'ANONYMOUS' | 'CITIZEN'>('STUDENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const inst = SYNTHETIC_INSTITUTIONS.find(i => i.id === institutionId);

    onSubmit({
      title,
      description,
      institutionId,
      institutionName: inst?.name || 'Selected Technical Institute',
      institutionState: inst?.state || 'Delhi NCR',
      category,
      categoryLabel: category.replace(/_/g, ' '),
      priority,
      complainantName: complainantType === 'ANONYMOUS' ? 'Anonymous Complainant' : (complainantName || 'Citizen Complainant'),
      complainantType,
    });

    onClose();
    // Reset form
    setTitle('');
    setDescription('');
    setComplainantName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Institution Complaint"
      subtitle="AICTE Centralized Ingestion Intake • Synthetic Session Store"
      maxWidth="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim()}
          >
            Submit & Allocate Tracking ID
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Institution selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
            Affiliated Technical Institute *
          </label>
          <select
            value={institutionId}
            onChange={(e) => setInstitutionId(e.target.value)}
            className="w-full bg-white border border-[#D5CEC2] rounded-md px-3 py-2 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
            required
          >
            {SYNTHETIC_INSTITUTIONS.map((inst) => (
              <option key={inst.id} value={inst.id}>
                {inst.name} ({inst.district}, {inst.state}) - PID: {inst.aictePermanentId}
              </option>
            ))}
          </select>
        </div>

        {/* Category & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Grievance Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
              className="w-full bg-white border border-[#D5CEC2] rounded-md px-3 py-2 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
            >
              <option value="ADMISSION_FRAUD">Admission Fraud / Capitation</option>
              <option value="RAGGING">Ragging & Student Harassment</option>
              <option value="FACULTY_NON_PAYMENT">Faculty Salary & Arrears</option>
              <option value="INFRASTRUCTURE">Deficient Lab & Infrastructure</option>
              <option value="CURRICULUM_ACCREDITATION">Accreditation / Norms Violation</option>
              <option value="FEE_EXTORTION">Fee Extortion</option>
              <option value="OTHER">Other Jurisdictional Complaint</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Urgency / Priority *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
              className="w-full bg-white border border-[#D5CEC2] rounded-md px-3 py-2 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
            >
              <option value="CRITICAL">Critical (Immediate SLA Trigger)</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* Complainant Persona */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
              Complainant Category
            </label>
            <select
              value={complainantType}
              onChange={(e) => setComplainantType(e.target.value as any)}
              className="w-full bg-white border border-[#D5CEC2] rounded-md px-3 py-2 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty Member</option>
              <option value="PARENT">Parent / Guardian</option>
              <option value="CITIZEN">Citizen / Alumni</option>
              <option value="ANONYMOUS">Whistleblower (Anonymous)</option>
            </select>
          </div>

          {complainantType !== 'ANONYMOUS' && (
            <div>
              <Input
                label="Complainant Full Name"
                placeholder="e.g. Pooja Mehta"
                value={complainantName}
                onChange={(e) => setComplainantName(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <Input
            label="Brief Subject / Grievance Summary *"
            placeholder="e.g. Mandatory unreceipted donation demanded for seat confirmation"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5568] mb-1.5">
            Full Factual Statement & Details *
          </label>
          <textarea
            rows={4}
            placeholder="Describe the incident, names of officials or staff involved, dates, and evidence attachments available..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-[#D5CEC2] rounded-md px-3 py-2 text-xs text-[#1F2421] placeholder-[#A0AEC0] focus:outline-none focus:border-[#1B4532] focus:ring-1 focus:ring-[#1B4532]"
            required
          />
        </div>
      </form>
    </Modal>
  );
};
