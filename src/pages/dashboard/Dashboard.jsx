import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-xl font-bold">
            Project Management
          </h1>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="mt-2 text-slate-400">
            Welcome back, {user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">
              Projects
            </p>

            <p className="text-3xl font-bold mt-2">
              0
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">
              Tasks
            </p>

            <p className="text-3xl font-bold mt-2">
              0
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-slate-400">
              Role
            </p>

            <p className="text-3xl font-bold mt-2 capitalize">
              {user?.role}
            </p>
          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;