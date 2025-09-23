import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, Building2, Paperclip, Download, Eye, Plus } from 'lucide-react';
import DataTable from './DataTable';
import AddDocumentModal from './AddDocumentModal';
import { getAuthHeaders } from '@/utils/auth';
// import {useCustomerData} from '../hooks/useCustomerData';
import { useToast } from "@/hooks/use-toast";

interface BackDatedCheque {
  id: string;
  sn: number;
  chequeNo: string;
  amount: number;
  bankName: string;
  issueDate: string;
  dueDate: string;
  status: 'pending' | 'cleared' | 'bounced';
  fileUrl?: string;
}

interface BankGuarantee {
  id: string;
  sn: number;
  guaranteeNo: string;
  amount: number;
  bankName: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'claimed';
  fileUrl?: string;
}

interface SupplierAttachment {
  _id: string;
  fileName: string;
  fileType: string;
  category: string;
  createdAt: string;
  fileUrl: string;
  fileSize: string;
}

interface AdditionalDocumentsProps {
  supplierID: string;
}

const AdditionalDocuments: React.FC<AdditionalDocumentsProps> = ({ supplierID }) => {
  const [showAttachments, setShowAttachments] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const { toast } = useToast();

  // State for fetched data
  const [backDatedCheques, setBackDatedCheques] = useState<BackDatedCheque[]>([]);
  const [bankGuarantees, setBankGuarantees] = useState<BankGuarantee[]>([]);
  const [supplierAttachments, setSupplierAttachments] = useState<SupplierAttachment[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.REACT_APP_API_URL}/financial-documents/supplier/${supplierID}`,
          {
            headers: getAuthHeaders(),
          }
        );
        const data = await res.json();

        // Filter and map data by type
        setBackDatedCheques(
          (data.documents || []).filter((doc: any) => doc.type === 'cheque')
        );
        setBankGuarantees(
          (data.documents || []).filter((doc: any) => doc.type === 'guarantee')
        );
        setSupplierAttachments(
          (data.documents || []).filter((doc: any) => doc.type === 'attachment')
        );
      } catch (err) {
        // Handle error (show toast, etc.)
        setBackDatedCheques([]);
        setBankGuarantees([]);
        setSupplierAttachments([]);
      }
    };

    if (supplierID) fetchDocuments();
  }, [supplierID]);

  console.log('Checking for the data of Financial Documents from API Call: ');
  console.log('BackDatedCheque', backDatedCheques);
  console.log('BankGurantee', bankGuarantees);
  console.log('supplier Attachments', supplierAttachments);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      cleared: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      bounced: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
      active: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      expired: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800' },
      claimed: { variant: 'destructive' as const, className: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const chequeColumns = [
    { 
      key: 'sn', 
      header: 'S.N.', 
      className: 'font-medium text-muted-foreground',
      width: '80px',
      // render: (_: any, __: any, index: number) => index + 1 // <-- Add this line
    },
    { 
      key: 'chequeNo', 
      header: 'Cheque No', 
      render: (chequeNo: string) => (
        <span className="font-mono font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
          {chequeNo}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'amount', 
      header: 'Amount', 
      render: (amount: number) => (
        <span className="font-bold text-blue-600">
          Rs.{amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}
        </span>
      ),
      width: '140px'
    },
    { 
      key: 'bankName', 
      header: 'Bank Name',
      render: (bankName: string) => (
        <span className="text-sm font-medium">{bankName}</span>
      )
    },
    { 
      key: 'issueDate', 
      header: 'Issue Date', 
      render: (date: string) => (
        <span className="font-medium">
          {new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'dueDate', 
      header: 'Due Date', 
      render: (date: string) => (
        <span className="font-medium">
          {new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (status: string) => getStatusBadge(status),
      width: '100px'
    },
    { 
      key: 'fileUrl', 
      header: 'Attachment',
      render: (attachment: string) => (
        attachment ? (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-3"
          >
            <a 
              href={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${attachment}`}
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </a>
          </Button>
        ) : (
          <span className="text-muted-foreground text-xs">No file</span>
        )
      ),
      width: '100px'
    }
  ];

  const guaranteeColumns = [
    { 
      key: 'sn', 
      header: 'S.N.', 
      className: 'font-medium text-muted-foreground',
      width: '80px'
    },
    { 
      key: 'guaranteeNo', 
      header: 'Guarantee No', 
      render: (guaranteeNo: string) => (
        <span className="font-mono font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
          {guaranteeNo}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'amount', 
      header: 'Amount', 
      render: (amount: number) => (
        <span className="font-bold text-blue-600">
          Rs.{amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}
        </span>
      ),
      width: '140px'
    },
    { 
      key: 'bankName', 
      header: 'Bank Name',
      render: (bankName: string) => (
        <span className="text-sm font-medium">{bankName}</span>
      )
    },
    { 
      key: 'issueDate', 
      header: 'Issue Date', 
      render: (date: string) => (
        <span className="font-medium">
          {new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'expiryDate', 
      header: 'Expiry Date', 
      render: (date: string) => (
        <span className="font-medium">
          {new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'numeric',
            year: 'numeric'
          })}
        </span>
      ),
      width: '120px'
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (status: string) => getStatusBadge(status),
      width: '100px'
    },
    { 
      key: 'fileUrl', 
      header: 'Attachment',
      render: (attachment: string) => (
        attachment ? (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-3"
          >
            <a 
              href={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${attachment}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </a>
          </Button>
        ) : (
          <span className="text-muted-foreground text-xs">No file</span>
        )
      ),
      width: '100px'
    }
  ];

  const AttachmentsModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Paperclip className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Supplier Attachments</h2>
                <p className="text-muted-foreground">Contract agreements, legal documents, and other files</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowAttachments(false)}
              className="border-gray-300"
            >
              Close
            </Button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {supplierAttachments.length > 0 ? (
            <div className="space-y-4">
              {supplierAttachments.map((attachment) => (
                <div 
                  key={attachment._id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{attachment.fileName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {attachment.category}
                        </span>
                        <span>{attachment.fileSize}</span>
                        <span>
                          Uploaded: {new Date(attachment.createdAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8"
                    >
                      <a 
                        href={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${attachment.fileUrl}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="h-8"
                    >
                      <a 
                        href={`${import.meta.env.REACT_APP_BACKEND_IMAGE_URL}${attachment.fileUrl}`} 
                        download={attachment.fileName}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Paperclip className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No attachments found</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Supplier documents will appear here when uploaded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Dummy handler for form submit
  const handleAddDocument = async (formData: any) => {
    // TODO: Replace with actual API call or state update
    console.log('New Document:', formData);
    // here append the formData with [COMPANYID, CUSTOMERID] => {companyID, customerID}
    formData.supplierID = supplierID;
    formData.companyID = localStorage.getItem("companyID");

    console.log("Updated Document: ", formData);
    const url = `${import.meta.env.REACT_APP_API_URL}/financial-documents/supplier`;  
    try {
      const form = new FormData();
      // Append all fields to FormData
      for (const key in formData) {
        if (formData[key] !== undefined && formData[key] !== null) {
          form.append(key, formData[key]);
        }
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "X-Role": localStorage.getItem("role") || "",
          // Do NOT set Content-Type, browser will set it for FormData
        },
        body: form,
      });
      const res_data = await response.json();
      console.log(`Response Data from server after Financial Document create: `);
      console.log(res_data);

      if (response.ok) {
        toast({
          title: "Success",
          description: `Financial Document Uploaded Successfully.`,
        });
        // fetchAdmins();
        // setFormData({})
        // TODO: close the model
        return true;
      } else {
        toast({
          title: "Error",
          description: `Failed to upload Finacial Document: ${res_data.msg}`,
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload Financial Document",
        variant: "destructive",
      });
      return false;
    }

  };

  // Add S.N. to each row before passing to DataTable
  const chequesWithSN = backDatedCheques.map((item, idx) => ({
    ...item,
    sn: idx + 1,
  }));

  const guaranteesWithSN = bankGuarantees.map((item, idx) => ({
    ...item,
    sn: idx + 1,
  }));

  return (
    <div className="space-y-8">
      {/* Section Header with Attachments Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Financial Documents</h2>
          <p className="text-muted-foreground mt-1">
            BackDated cheques, bank guarantees, and supplier attachments
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddModal(true)}
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <Button 
            onClick={() => setShowAttachments(true)}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-colors duration-200"
          >
            <Paperclip className="h-4 w-4 mr-2" />
            Attachments ({supplierAttachments.length})
          </Button>
        </div>
      </div>

      {/* BackDated Cheques and Bank Guarantees */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <DataTable
          title="BackDated Cheques"
          data={chequesWithSN} // <-- use chequesWithSN
          columns={chequeColumns}
          icon={<FileText className="h-5 w-5" />}
          emptyMessage="No backdated cheques found"
        />

        <DataTable
          title="Bank Guarantees"
          data={guaranteesWithSN} // <-- use guaranteesWithSN
          columns={guaranteeColumns}
          icon={<Building2 className="h-5 w-5" />}
          emptyMessage="No bank guarantees found"
        />
      </div>

      {/* Add New Modal */}
      <AddDocumentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddDocument}
      />

      {/* Attachments Modal */}
      {showAttachments && <AttachmentsModal />}
    </div>
  );
};

export default AdditionalDocuments;
