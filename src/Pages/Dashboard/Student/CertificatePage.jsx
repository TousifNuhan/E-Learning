import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { MdDownload, MdCheckCircle, MdLock } from 'react-icons/md';

const CertificatePage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const certRef = useRef(null);

    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        axiosSecure.get(`/certificate/status/${classId}`)
            .then(res => setStatus(res.data))
            .catch(err => {
                toast.error(err?.response?.data?.message || 'Failed to check certificate eligibility');
            })
            .finally(() => setLoading(false));
    }, [classId, axiosSecure]);

    const handleDownload = async () => {
        if (!certRef.current) return;
        try {
            setDownloading(true);
            const canvas = await html2canvas(certRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${(status?.courseTitle || 'certificate').replace(/\s+/g, '_')}_Certificate.pdf`);
        } catch (err) {
            toast.error(err?.message || 'Failed to generate certificate PDF');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center text-stone-500 min-h-[300px] flex flex-col items-center justify-center font-sans">
                <div className="animate-spin h-8 w-8 border-4 border-[#07A698] border-t-transparent rounded-full mb-2" />
                <p className="text-xs font-semibold">Checking certificate eligibility...</p>
            </div>
        );
    }

    if (!status) {
        return (
            <div className="p-8 text-center text-stone-500 font-sans">
                Could not load certificate status.
            </div>
        );
    }

    if (!status.eligible) {
        return (
            <div className="p-4 md:p-8 max-w-3xl mx-auto font-sans">
                <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center space-y-4">
                    <MdLock className="text-4xl text-stone-300 mx-auto" />
                    <h2 className="text-lg font-bold text-stone-900">Certificate Not Yet Available</h2>
                    <p className="text-sm text-stone-500">
                        {status.reason || `Complete and pass all assignments (score ${status.threshold}+) to unlock your certificate.`}
                    </p>

                    {status.totalAssignments > 0 && (
                        <div className="text-left space-y-2 pt-4 border-t border-stone-100">
                            <p className="text-xs font-bold text-stone-600 uppercase tracking-wide">
                                Progress: {status.passedAssignments}/{status.totalAssignments} passed
                            </p>
                            {status.breakdown?.map((a) => (
                                <div key={a.assignmentId} className="flex items-center justify-between text-xs bg-stone-50 rounded-lg p-3">
                                    <span className="font-medium text-stone-700">{a.title}</span>
                                    <span className={`font-bold ${a.passed ? 'text-emerald-600' : 'text-stone-400'}`}>
                                        {a.submitted ? (a.grade !== null ? `${a.grade}%` : 'Pending grading') : 'Not submitted'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={() => navigate(-1)}
                        className="text-xs font-bold text-[#07A698] hover:text-[#05857a] underline underline-offset-4 cursor-pointer"
                    >
                        Back to Course
                    </button>
                </div>
            </div>
        );
    }

    const completionDateStr = status.completionDate
        ? new Date(status.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 font-sans">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <MdCheckCircle className="text-[#07A698]" />
                    Certificate of Completion
                </h1>
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#07A698] hover:bg-[#05857a] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                    <MdDownload />
                    {downloading ? 'Generating...' : 'Download PDF'}
                </button>
            </div>

            <div className="overflow-x-auto">
                <div
                    ref={certRef}
                    className="mx-auto p-12 md:p-16 aspect-[1.414/1] w-full max-w-3xl flex flex-col items-center justify-center text-center space-y-6 relative"
                    style={{
                        fontFamily: 'serif',
                        backgroundColor: '#ffffff',
                        border: '10px double #07A698'
                    }}
                >
                    <div
                        className="absolute top-6 left-6 text-[10px] tracking-[0.3em] uppercase"
                        style={{ color: '#a8a29e' }}
                    >
                        EdCare
                    </div>
                    <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#a8a29e' }}>
                        Certificate of Completion
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#1c1917' }}>
                        This is to certify that
                    </h2>
                    <p
                        className="text-2xl md:text-3xl font-bold pb-2 px-8"
                        style={{ color: '#07A698', borderBottom: '2px solid #e7e5e4' }}
                    >
                        {status.studentName}
                    </p>
                    <p className="text-sm md:text-base max-w-xl leading-relaxed" style={{ color: '#57534e' }}>
                        has successfully completed the course
                    </p>
                    <p className="text-xl md:text-2xl font-bold" style={{ color: '#1c1917' }}>
                        "{status.courseTitle}"
                    </p>
                    <p className="text-xs pt-4" style={{ color: '#a8a29e' }}>
                        Completed on {completionDateStr}
                    </p>
                    <div className="flex justify-between items-center w-full pt-10 text-xs" style={{ color: '#78716c' }}>
                        <div className="text-center">
                            <p
                                className="pb-1"
                                style={{
                                    fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
                                    fontSize: '1.4rem',
                                    color: '#1c1917',
                                    lineHeight: 1.2
                                }}
                            >
                                {status.instructorName?.trim().split(/\s+/).pop()}
                            </p>
                            <p
                                className="pt-1 px-6"
                                style={{
                                    fontFamily: "'Brush Script MT', cursive",
                                    fontSize: '1.1rem',
                                    color: '#1c1917',
                                    borderTop: '1px solid #d6d3d1'
                                }}
                            >
                                {status.instructorName}
                            </p>
                            <p>Instructor</p>
                        </div>
                        <div className="text-center">
                            <p
                                className="font-bold pt-1 px-6"
                                style={{ color: '#1c1917', borderTop: '1px solid #d6d3d1' }}
                            >
                                EdCare
                            </p>
                            <p>Platform</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePage;