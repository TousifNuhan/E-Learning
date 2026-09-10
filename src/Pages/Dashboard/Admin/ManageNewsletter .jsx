import React, { useEffect, useState, useMemo } from 'react';
import { FiMail, FiDownload, FiUsers, FiSearch } from 'react-icons/fi';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const ManageNewsletter = () => {
    const axiosSecure = useAxiosSecure();
    const [subscribers, setSubscribers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchSubscribers = async () => {
        try {
            const res = await axiosSecure.get('/newsletter/subscribers');
            setSubscribers(res.data || []);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to fetch subscribers.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, [axiosSecure]);

    const filteredSubscribers = useMemo(() => {
        if (!searchTerm.trim()) return subscribers;
        return subscribers.filter((sub) =>
            sub.email?.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
    }, [subscribers, searchTerm]);

    const handleExportCSV = () => {
        const rows = [['Email', 'Subscribed At']];
        subscribers.forEach((sub) => {
            rows.push([
                `"${(sub.email || '').replace(/"/g, '""')}"`,
                `"${new Date(sub.subscribedAt).toLocaleString()}"`
            ]);
        });

        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((r) => r.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'newsletter_subscribers.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Subscriber list exported successfully!');
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center font-sans">
                <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 font-sans text-stone-800">
            <div className="border-b border-stone-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#162726] flex items-center gap-2">
                        <FiMail className="text-[#07A698] shrink-0" /> Newsletter Subscribers
                    </h1>
                    <p className="text-xs text-stone-500 pt-1 font-medium">
                        Everyone who signed up via the footer subscription form.
                    </p>
                </div>

                {subscribers.length > 0 && (
                    <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-2 bg-[#162726] hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                        <FiDownload className="w-4 h-4 shrink-0" />
                        Export CSV
                    </button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 bg-[#07A698]/10 text-[#07A698] border border-[#07A698]/20 px-3.5 py-1.5 rounded-xl text-xs font-bold w-fit">
                    <FiUsers className="shrink-0" />
                    <span>{subscribers.length} Total Subscriber{subscribers.length !== 1 ? 's' : ''}</span>
                </div>

                {subscribers.length > 0 && (
                    <div className="relative w-full sm:w-72">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-3.5 h-3.5 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search subscribers by email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-[#07A698] transition-all shadow-xs"
                        />
                    </div>
                )}
            </div>

            {subscribers.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs font-medium">
                    No newsletter subscribers registered yet.
                </div>
            ) : filteredSubscribers.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 text-xs font-medium">
                    No subscribers found matching "{searchTerm}".
                </div>
            ) : (
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[500px]">
                            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 w-12 text-center">#</th>
                                    <th className="p-4">Email Address</th>
                                    <th className="p-4 text-right">Subscribed On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 text-[#162726]">
                                {filteredSubscribers.map((sub, idx) => (
                                    <tr key={sub._id || idx} className="hover:bg-stone-50/60 transition-colors">
                                        <td className="p-4 text-center text-stone-400 font-medium">
                                            {idx + 1}
                                        </td>
                                        <td className="p-4 font-bold break-all">
                                            <span className="flex items-center gap-2">
                                                <FiMail className="text-stone-400 shrink-0" />
                                                {sub.email}
                                            </span>
                                        </td>
                                        <td className="p-4 text-stone-500 font-medium text-right whitespace-nowrap">
                                            {sub.subscribedAt
                                                ? new Date(sub.subscribedAt).toLocaleString('en-US', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                      hour: '2-digit',
                                                      minute: '2-digit'
                                                  })
                                                : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageNewsletter;