import { getAuthHeaders } from '@/utils/auth';
import { useEffect, useState } from 'react';

export function useDashboardData() {
    const [data, setData] = useState(null);
    const [transactionalDistribution, setTransactionalDistribution] = useState([]);
    const [netRevenue, setNetRevenue] = useState([]);
    const [fiscalYearTotalRevenue, setFiscalYearTotalRevenue] = useState();
    const [receivable, setReceivable] = useState([]);
    const [topCustomers, setTopCustomes] = useState([]);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]);
    const [fiscalYearTotalEarning, setFiscalYearTotalEarning] = useState();
    const [salesPaymentRatio, setSalesPaymentRatio] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get dependencies that should trigger re-fetch
    const role = localStorage.getItem('role');
    const companyID = localStorage.getItem('companyID');

    const fetchData = async () => {
        if (!role) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const baseUrl = `${import.meta.env.REACT_APP_API_URL}/dashboard/data`;
            const isAdmin = role === 'admin';
            const queryParams = new URLSearchParams();
            if (isAdmin && companyID) {
                queryParams.append('companyID', companyID);
            }
            const url = `${baseUrl}?${queryParams.toString()}`;
            const res = await fetch(url, {
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error('Failed to fetch dashboard data');
            const data = await res.json();
            setData(data);
            //setting values here:
            setTransactionalDistribution(data.transactionalDistribution || []);
            setNetRevenue(data.netRevenue || []);
            setFiscalYearTotalRevenue(data.fiscalYearTotalRevenue?.totalRevenue?.[0]?.totalRevenue || 0)
            setReceivable(data.recievableSummary || {});
            setMonthlyRevenue(data.monthlyRevenue || []);
            setFiscalYearTotalEarning(data.fiscalYearTotalEarning?.totalEarning?.[0]?.totalEarning || 0);
            setSalesPaymentRatio(data.salesVsPurchase || []);

        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const topThreeCustomers = async () => {
        if (!role) return;

        try {
            const baseUrl = `${import.meta.env.REACT_APP_API_URL}/due/getAllCustomerCompleteData`;
            const isAdmin = role === 'admin';
            const queryParams = new URLSearchParams();
            if (isAdmin && companyID) {
                queryParams.append('companyID', companyID);
            }
            const url = `${baseUrl}?${queryParams.toString()}`;

            const res = await fetch(url, {
                headers: getAuthHeaders(),
            });
            if (!res.ok) throw new Error('Failed to fetch customer data');
            const data = await res.json();

            console.log('customer data for top three result is: ', data.customers);

            const topCustomers = (data.customers || [])
                .sort((a, b) => b.totalSales - a.totalSales)
                .slice(0, 3)
                .map(c => ({
                    name: c.name,
                    totalSales: c.totalSales,
                    totalDue: c.totalDue
                }));
            
            setTopCustomes(topCustomers);
        } catch (err) {
            console.error('Error fetching top customers:', err);
        }
    }

    console.log('top three customers: ', topCustomers);

    // Add dependencies to useEffect
    useEffect(() => {
        fetchData();
        topThreeCustomers();
    }, [role, companyID]); // Re-run when role or companyID changes

    console.log('sales vs purchase ratio data: ', salesPaymentRatio);

    return { 
        transactionalDistribution,
        netRevenue,
        fiscalYearTotalRevenue,
        receivable,
        topCustomers,
        monthlyRevenue,
        fiscalYearTotalEarning,
        salesPaymentRatio,
        loading, 
        error 
    };
}
