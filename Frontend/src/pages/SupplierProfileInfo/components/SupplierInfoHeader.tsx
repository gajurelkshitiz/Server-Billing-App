import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PaymentStatusBadge from '@/components/ui/paymentStatusBadge';
import type { Customer } from '@/pages/CustomerProfileInfo/hooks/useCustomerData';
import type { Supplier } from '@/pages/SupplierProfileInfo/hooks/useSupplierData';

interface CustomerInfoHeaderProps {
  supplier: Supplier;
}

const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  iconColor?: string;
}> = ({ icon, label, value, iconColor = "text-primary" }) => (
  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/20 border border-border/40">
    <div className={`${iconColor} mt-0.5 flex-shrink-0`}>
      {icon}
    </div>
    <div className="space-y-1 min-w-0 flex-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base font-semibold text-foreground break-words">
        {value}
      </div>
    </div>
  </div>
);

const SupplierInfoHeader: React.FC<CustomerInfoHeaderProps> = ({ supplier }) => {
  return (
    <Card className="border border-border/40 shadow-sm bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
            <div className="bg-primary/10 p-2 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            Supplier Information
          </CardTitle>
          <Badge variant="outline" className="px-3 py-1">
            ID: {supplier.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Name - Featured */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Supplier Name</p>
              <h2 className="text-2xl font-bold text-foreground">{supplier.name}</h2>
            </div>
          </div>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem
            icon={<Mail className="h-4 w-4" />}
            label="Email Address"
            value={supplier.email || "Not provided"}
            iconColor="text-blue-600"
          />
          
          <InfoItem
            icon={<Phone className="h-4 w-4" />}
            label="Phone Number"
            value={supplier.phone || "Not provided"}
            iconColor="text-green-600"
          />
          
          <InfoItem
            icon={<Shield className="h-4 w-4" />}
            label="Account Status"
            value={<PaymentStatusBadge status={supplier.status} />}
            iconColor="text-purple-600"
          />
        </div>

        {/* Address - Full Width */}
        <div className="mt-4">
          <InfoItem
            icon={<MapPin className="h-4 w-4" />}
            label="Address"
            value={supplier.address || "Address not provided"}
            iconColor="text-orange-600"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierInfoHeader;