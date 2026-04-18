import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

interface Case {
    _id: string;
    title: string;
    status: string;
    client: { name: string; email: string };
    deadlines: { dueDate: string; task: string }[];
}

const LawyerDashboard = () => {
    const [cases, setCases] = useState<Case[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [newCase, setNewCase] = useState({ title: '', clientEmail: '' });

    // טעינת התיקים מהשרת
    const fetchCases = async () => {
        try {
            const res = await api.get('/cases');
            setCases(res.data);
        } catch (err) {
            console.error('Failed to fetch cases');
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    // יצירת תיק חדש
    const handleCreateCase = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/cases', newCase);
            setNewCase({ title: '', clientEmail: '' });
            setShowForm(false);
            fetchCases(); // רענון הרשימה
        } catch (err) {
            alert('שגיאה ביצירת התיק. ודא שהלקוח רשום במערכת.');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto font-sans" dir="rtl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800">ניהול תיקים - עורך דין</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                    {showForm ? 'סגור טופס' : '+ תיק חדש'}
                </button>
            </div>

            {/* טופס יצירת תיק */}
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-blue-600">
                    <h2 className="text-lg font-semibold mb-4">פתיחת תיק חדש</h2>
                    <form onSubmit={handleCreateCase} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="שם התיק (למשל: תביעת נזיקין - כהן)"
                            className="border p-2 rounded"
                            value={newCase.title}
                            onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                            required
                        />
                        <input
                            type="email"
                            placeholder="אימייל הלקוח (חייב להיות רשום)"
                            className="border p-2 rounded"
                            value={newCase.clientEmail}
                            onChange={(e) => setNewCase({ ...newCase, clientEmail: e.target.value })}
                            required
                        />
                        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700 col-span-full">
                            צור תיק במערכת
                        </button>
                    </form>
                </div>
            )}

            {/* רשימת התיקים */}
            <div className="grid grid-cols-1 gap-6">
                {cases.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">אין תיקים פעילים כרגע.</p>
                ) : (
                    cases.map((c) => (
                        <div key={c._id} className="bg-white p-6 rounded-lg shadow border-r-4 border-blue-500 hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{c.title}</h3>
                                    <p className="text-sm text-gray-600">לקוח: {c.client.name} ({c.client.email})</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {c.status === 'open' ? 'פעיל' : 'בטיפול'}
                                </span>
                            </div>

                            {/* הצגת דדליין קרוב אם קיים */}
                            {c.deadlines.length > 0 && (
                                <div className="mt-4 p-3 bg-red-50 rounded border border-red-100">
                                    <p className="text-xs text-red-600 font-bold uppercase">אירוע קרוב:</p>
                                    <p className="text-sm text-gray-800">
                                        {c.deadlines[0].task} בתאריך {new Date(c.deadlines[0].dueDate).toLocaleDateString('he-IL')}
                                    </p>
                                </div>
                            )}

                            <Link to={`/lawyer/case/${c._id}`} className="mt-4 text-blue-600 text-sm font-semibold hover:underline">
                                לניהול מלא ועדכון סטטוס ←
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LawyerDashboard;