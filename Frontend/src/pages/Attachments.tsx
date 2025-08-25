import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { CompanyContextType, useCompanyStateGlobal } from "@/provider/companyState";
import { useNavigate } from "react-router-dom";
import { getAuthHeaders } from '@/utils/auth';
import { FaFileContract } from "react-icons/fa"; // Add this import at the top


const CATEGORIES = [
  "Company Registration",
  "PAN No",
  "Audit Report",
  "EXIM Code",
  "Banijya Document",
  "Other"
];

const defaultForm = {
  filePath: null,
  fileName: "",
  category: "",
  dateOfFile: "",
  message: "",
  companyID: "",
};

const API_URL = `${import.meta.env.REACT_APP_API_URL}/company-attachments`;

const AttachmentsPage: React.FC = () => {
  const navigate = useNavigate();

  const { state, dispatch }: CompanyContextType = useCompanyStateGlobal();
  const role = localStorage.getItem('role');
  const companyID = localStorage.getItem('companyID');

  useEffect(() => {
      if (state.companyID == 'all' && state.companyID) {
       navigate('/dashboard');
      }
  }, [state.companyID]);

  const [attachments, setAttachments] = useState<any[]>([]);
  const [form, setForm] = useState({ ...defaultForm });
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");

  // Fetch attachments from backend
  useEffect(() => {
    async function fetchAttachments() {
      // here use the 'companyID' from localhost instead: [ ..of relying on context API.. ]
      console.log(`URL FOR FETCHING:- ${import.meta.env.REACT_APP_API_URL}/company-attachments?companyID=${companyID}`); 
      try {
        const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/company-attachments?companyID=${companyID}&filter=${filter}`, 
          { 
            headers: getAuthHeaders() 
        });
        const data = await res.json();
        console.log('Data from backend of attachments: ', data);
        // setAttachments(data || []);
        setAttachments(data.attachments || []);
      } catch (err) {
        toast.error("Failed to fetch attachments");
      }
    }
    fetchAttachments();

    console.log('After fetching the Attachments: ', attachments);
  }, []);

  const handleChange = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleChange("filePath", e.target.files[0]);
      // handleChange("fileName", e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.filePath || !form.category) {
      toast.error("File and category are required");
      return;
    }
    console.log('for checking the content of form: ', form);

    const formData = new FormData();
    formData.append("companyAttachment", form.filePath);
    formData.append("category", form.category);
    formData.append("fileName", form.fileName);
    formData.append("dateOfFile", format(new Date(), "yyyy-MM-dd"));
    formData.append("message", form.message);
    formData.append("companyID", companyID);

    console.log("Chekcing the FormData before sending to backend: ", formData);

    try {
      const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/company-attachments`, 
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "X-Role": localStorage.getItem("role") || "",
          },
          body: formData,
      });
      const res_data = await res.json();
      setAttachments((prev) => [res_data, ...prev]);
      setForm({ ...defaultForm });
      setShowModal(false);
      toast.success("Attachment uploaded!");
    } catch (err) {
      toast.error("Failed to upload attachment");
    }
  };

  const filteredAttachments = filter
    ? attachments.filter((a) => a.category === filter)
    : attachments;

  return (
    <div className="max-w-6xl mx-auto py-10 px-2 md:px-0 min-h-[90vh] bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-white shadow p-3 rounded-lg flex items-center justify-center">
            <FaFileContract className="text-blue-700" size={28} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text--800">Attachments</h1>
            <div className="text-gray-500 text-sm mt-1">Upload and manage company documents and files</div>
          </div>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg shadow flex items-center gap-2">
          <svg width="25" height="25" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M12 5v14m7-7H5"/></svg>
          + Add Attachment
        </Button>
      </div>
      <Card className="p-6 shadow border-blue-100 bg-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex gap-2 items-center">
            <Label className="font-semibold text-blue-700">Filter by Category:</Label>
            <select
              className="border rounded px-2 py-1"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">All</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Card/List style display */}
        <div className="flex flex-col gap-4">
          {filteredAttachments.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No attachments found.</div>
          ) : (
            filteredAttachments.map((att) => {
              // File size display
              let fileSize = '';
              if (att.filePath && att.filePath.size) {
                if (att.filePath.size > 1024 * 1024) {
                  fileSize = (att.filePath.size / (1024 * 1024)).toFixed(1) + ' MB';
                } else if (att.filePath.size > 1024) {
                  fileSize = (att.filePath.size / 1024).toFixed(0) + ' KB';
                } else {
                  fileSize = att.filePath.size + ' B';
                }
              }
              // File icon (PDF/doc/image)
              let icon = (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#F87171"/><path d="M8 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8.828a2 2 0 0 0-.586-1.414l-3.828-3.828A2 2 0 0 0 12.172 2H8Zm4 1.414L18.586 8H14a2 2 0 0 1-2-2V3.414Z" fill="#fff"/></svg>
              );
              return (
                <div key={att._id} className="flex items-center gap-4 p-5 border rounded-lg bg-white shadow-sm">
                  {/* Icon */}
                  <div className="flex-shrink-0">{icon}</div>
                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg text-gray-900 truncate">{att.fileName}</span>
                      {att.category && (
                        <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold whitespace-nowrap">{att.category}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                      {fileSize && <span>{fileSize}</span>}
                      <span>Uploaded: {att.dateOfFile}</span>
                      {att.message && <span className="truncate max-w-xs">{att.message}</span>}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 ml-4">
                    {att.filePath ? (
                      <>
                        <a
                          href={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${att.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium text-sm transition shadow-sm"
                        >
                          {/* Eye icon */}
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#2563eb" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#2563eb" strokeWidth="2"/></svg>
                          View
                        </a>
                        <a
                          href={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${att.filePath}`}
                          download={att.fileName}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium text-sm transition shadow-sm"
                        >
                          {/* Download icon */}
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Download
                        </a>
                      </>
                    ) : (
                      <span className="text-gray-400">No file</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Modal Form for Upload */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-700">Add Attachment</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label>File</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" onChange={handleFileChange} required />
              </div>
              <div>
                <Label>Category</Label>
                <select
                  className="w-full border rounded px-2 py-2"
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>File Name</Label>
                <Input
                  value={form.fileName}
                  onChange={(e) => handleChange("fileName", e.target.value)}
                  placeholder="File Name"
                  required
                />
              </div>
              <div>
                <Label>Date of File</Label>
                <Input
                  value={form.dateOfFile}
                  readOnly
                />
              </div>
              <div>
                <Label>Message / Note</Label>
                <Input
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Message or note about this attachment"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow">Upload</Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentsPage;
