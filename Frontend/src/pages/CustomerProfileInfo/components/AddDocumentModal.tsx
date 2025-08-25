import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from '@/components/common/DatePicker';

type DocumentType = 'attachment' | 'cheque' | 'guarantee';

interface AddDocumentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CATEGORY_OPTIONS = [
  'Contract Agreement',
  'Legal Documents',
  'Registration Documents',
  'Other'
];

const CHEQUE_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'cleared', label: 'Cleared' },
  { value: 'bounced', label: 'Bounced'}
];

const GUARANTEE_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'claimed', label: 'Claimed'}
];

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ open, onClose, onSubmit }) => {
  const [type, setType] = useState<DocumentType>('attachment');
  const [form, setForm] = useState<any>({});
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      handleChange('customerFinancialDocument', e.target.files[0].name);
    }
  };

  const handleTypeChange = (value: DocumentType) => {
    setType(value);
    setForm({});
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add validation here
    onSubmit({ ...form, type, file });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selector */}
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attachment">Customer Attachments</SelectItem>
                <SelectItem value="cheque">BackDated Cheques</SelectItem>
                <SelectItem value="guarantee">Bank Guarantees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Fields */}
          {type === 'attachment' && (
            <>
              <div>
                <label className="block mb-1 font-medium">File Upload</label>
                <Input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />
              </div>
              <div>
                <label className="block mb-1 font-medium">File Name</label>
                <Input
                  value={form.fileName || ''}
                  onChange={e => handleChange('fileName', e.target.value)}
                  placeholder="Enter file name"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <Select
                  value={form.category || ''}
                  onValueChange={val => handleChange('category', val)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {type === 'cheque' && (
            <>
              <div>
                <label className="block mb-1 font-medium">Cheque No</label>
                <Input
                  value={form.chequeNo || ''}
                  onChange={e => handleChange('chequeNo', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Amount</label>
                <Input
                  type="number"
                  value={form.amount || ''}
                  onChange={e => handleChange('amount', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Bank Name</label>
                <Input
                  value={form.bankName || ''}
                  onChange={e => handleChange('bankName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Issue Date</label>
                <DatePicker
                  formData={form}
                  handleInputChange={handleChange}
                  fieldName="issueDate"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Due Date</label>
                <DatePicker
                  formData={form}
                  handleInputChange={handleChange}
                  fieldName="dueDate"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">File Upload</label>
                <Input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <Select
                  value={form.status || ''}
                  onValueChange={val => handleChange('status', val)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHEQUE_STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {type === 'guarantee' && (
            <>
              <div>
                <label className="block mb-1 font-medium">Guarantee No</label>
                <Input
                  value={form.guaranteeNo || ''}
                  onChange={e => handleChange('guaranteeNo', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Amount</label>
                <Input
                  type="number"
                  value={form.amount || ''}
                  onChange={e => handleChange('amount', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Bank Name</label>
                <Input
                  value={form.bankName || ''}
                  onChange={e => handleChange('bankName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Issue Date</label>
                <DatePicker
                  formData={form}
                  handleInputChange={handleChange}
                  fieldName="issueDate"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Expiry Date</label>
                <DatePicker
                  formData={form}
                  handleInputChange={handleChange}
                  fieldName="expiryDate"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">File Upload</label>
                <Input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <Select
                  value={form.status || ''}
                  onValueChange={val => handleChange('status', val)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {GUARANTEE_STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentModal;