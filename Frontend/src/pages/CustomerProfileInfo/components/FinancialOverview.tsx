import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, CalendarDays, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Customer } from '@/pages/CustomerProfileInfo/hooks/useCustomerData';
import { useCustomerData } from '@/pages/CustomerProfileInfo/hooks/useCustomerData';

interface FinancialOverviewProps {
  customer: Customer;
}

const FinancialCard: React.FC<{
  title: string;
  amount: number;
  icon: React.ReactNode;
  colorClass: string;
  bgColorClass: string;
  trend?: 'up' | 'down' | 'neutral';
}> = ({ title, amount, icon, colorClass, bgColorClass, trend }) => (
  <Card className="border border-border/40 shadow-sm hover:shadow-md transition-all duration-200 bg-card">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {trend && (
              <div className={`${colorClass}`}>
                {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : 
                 trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
              </div>
            )}
          </div>
          <p className={`text-2xl font-bold ${colorClass} tracking-tight`}>
            Rs.{amount.toLocaleString('en-NP', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={`${bgColorClass} p-3 rounded-xl`}>
          <div className={`${colorClass}`}>
            {icon}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const DateCard: React.FC<{
  title: string;
  date: string;
  icon: React.ReactNode;
  colorClass: string;
}> = ({ title, date, icon, colorClass }) => (
  <Card className="border border-border/40 shadow-sm bg-card">
    <CardContent className="p-6">
      <div className="flex items-center gap-4">
        <div className={`${colorClass} bg-primary/10 p-3 rounded-xl`}>
          {icon}
        </div>
        <div className="space-y-1 flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-lg font-semibold text-foreground">
            {date ? new Date(date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'numeric',
              year: 'numeric'
            }) : (
              <span className="text-muted-foreground">No records yet</span>
            )}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ customer }) => {
  // Get updateCustomerCreditLimit from hook
  const { updateCustomerCreditLimit, updatingCredit, creditError } = useCustomerData(undefined, customer.id);
  const calculateBalance = () => {
    return customer.prevClosingBalance + customer.totalSales - customer.totalPayment;
  };

  const currentBalance = calculateBalance();

  // --- Credit Limit Edit State ---
  const [editing, setEditing] = useState(false);
  const getPrimitiveNumber = (val: any): number | '' => {
    if (val === undefined || val === null || val === '') return '';
    if (typeof val === 'number') return val;
    if (typeof val === 'object' && val !== null && 'valueOf' in val) return Number(val.valueOf());
    const parsed = Number(val);
    return isNaN(parsed) ? '' : parsed;
  };
  const [creditLimitAmount, setCreditLimitAmount] = useState<number | ''>(getPrimitiveNumber(customer.creditLimitAmount));
  const [creditTimePeriodInDays, setCreditTimePeriodInDays] = useState<number | ''>(getPrimitiveNumber(customer.creditTimePeriodInDays));

  const creditLimitExceeded =
    typeof customer.creditLimitAmount === 'number' &&
    typeof customer.totalDue === 'number' &&
    customer.creditLimitAmount > 0 &&
    customer.totalDue > customer.creditLimitAmount;

  // Save handler using API
  const handleSave = async () => {
    if (typeof creditLimitAmount !== 'number' || typeof creditTimePeriodInDays !== 'number') return;
    const success = await updateCustomerCreditLimit(creditLimitAmount, creditTimePeriodInDays);
    if (success) setEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Credit Limit Section */}
  <Card className={`border border-border/40 shadow-sm ${creditLimitExceeded ? 'bg-red-100' : 'bg-card'}`}> 
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            Credit Limit
            {creditLimitExceeded && (
              <Badge variant="destructive" className="ml-2 animate-pulse">Credit Limit Exceeded</Badge>
            )}
          </CardTitle>
          {!editing && (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          {editing ? (
            <form className="flex flex-col md:flex-row gap-4 items-end" onSubmit={e => { e.preventDefault(); handleSave(); }}>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Credit Limit Amount</label>
                <Input
                  type="number"
                  min={0}
                  value={creditLimitAmount}
                  onChange={e => setCreditLimitAmount(Number(e.target.value))}
                  className="w-40"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Credit Time Period (Days)</label>
                <Input
                  type="number"
                  min={0}
                  value={creditTimePeriodInDays}
                  onChange={e => setCreditTimePeriodInDays(Number(e.target.value))}
                  className="w-40"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={updatingCredit} className="bg-blue-600 hover:bg-blue-700">
                  {updatingCredit ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)} disabled={updatingCredit}>
                  Cancel
                </Button>
              </div>
              {creditError && <span className="text-red-600 text-xs mt-2">{creditError}</span>}
            </form>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div>
                <span className="text-sm text-muted-foreground">Credit Limit Amount</span>
                <div className="text-lg font-bold text-blue-700">
                  Rs.{getPrimitiveNumber(customer.creditLimitAmount) !== '' ? Number(getPrimitiveNumber(customer.creditLimitAmount)).toLocaleString('en-NP', { minimumFractionDigits: 2 }) : '-'}
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Credit Time Period (Days)</span>
                <div className="text-lg font-bold text-blue-700">
                  {getPrimitiveNumber(customer.creditTimePeriodInDays) !== '' ? getPrimitiveNumber(customer.creditTimePeriodInDays) : '-'}
                </div>
              </div>
              {creditLimitExceeded && (
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  <span className="text-red-600 font-semibold text-sm animate-pulse">Credit limit has been exceeded!</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Financial Overview</h2>
          <Badge variant={currentBalance > 0 ? "destructive" : "default"} className="px-3 py-1">
            {currentBalance > 0 ? "Outstanding Balance" : "Settled"}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <FinancialCard
            title="Total Due Left"
            amount={customer.totalDue}
            icon={<DollarSign className="h-6 w-6" />}
            colorClass="text-red-600"
            bgColorClass="bg-red-50"
            trend="down"
          />
          <FinancialCard
            title="Total Payments"
            amount={customer.totalPayment}
            icon={<DollarSign className="h-6 w-6" />}
            colorClass="text-green-600"
            bgColorClass="bg-green-50"
            trend="up"
          />
          <FinancialCard
            title="Previous Year Remaining Balance"
            amount={customer.prevClosingBalance}
            icon={<DollarSign className="h-6 w-6" />}
            colorClass="text-amber-600"
            bgColorClass="bg-amber-50"
            trend="neutral"
          />
          {/* <FinancialCard
            title="Total Sales"
            amount={customer.totalSales}
            icon={<ShoppingCart className="h-6 w-6" />}
            colorClass="text-blue-600"
            bgColorClass="bg-blue-50"
            trend="up"
          /> */}
        </div>
      </div>

      {/* Date Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DateCard
            title="Last Sales Transaction"
            date={customer.lastSalesDate}
            icon={<CalendarDays className="h-5 w-5" />}
            colorClass="text-blue-600"
          />
          <DateCard
            title="Last Payment Received"
            date={customer.lastPaymentDate}
            icon={<Clock className="h-5 w-5" />}
            colorClass="text-green-600"
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;