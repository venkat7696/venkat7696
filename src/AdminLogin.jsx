
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  IndianRupee,
  Plus,
  Search,
  Trash2,
  Edit,
  LogOut,
  Menu,
  X,
  Cpu,
  Eye,
  TrendingUp,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [projectList, setProjectList] = useState([
    {
      id: 1,
      title: "Automatic Adjustable Table",
      category: "Electronics",
      price: 2000,
      status: "Active",
    },
    {
      id: 2,
      title: "Bluetooth Jammer",
      category: "Communication",
      price: 2500,
      status: "Active",
    },
    {
      id: 3,
      title: "Smart Health Monitoring",
      category: "IoT",
      price: 3000,
      status: "Active",
    },
    {
      id: 4,
      title: "LoRa Communication Board",
      category: "Wireless",
      price: 2000,
      status: "Active",
    },
    {
      id: 5,
      title: "Smart Traffic Management",
      category: "Embedded Systems",
      price: 3000,
      status: "Active",
    },
    {
      id: 6,
      title: "Smart Weather Monitoring",
      category: "IoT",
      price: 2000,
      status: "Active",
    },
    {
      id: 7,
      title: "Smart Workbench ESP32",
      category: "Embedded Systems",
      price: 2500,
      status: "Active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Electronics",
    price: "",
  });

  const [enquiries] = useState([]);

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem("ecehubAdminDemo");
    navigate("/admin");
  };

  // ADD PROJECT
  const handleAddProject = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.price) {
      alert("Please enter project name and price.");
      return;
    }

    if (editingId !== null) {
      setProjectList((previous) =>
        previous.map((project) =>
          project.id === editingId
            ? {
                ...project,
                title: formData.title,
                category: formData.category,
                price: Number(formData.price),
              }
            : project
        )
      );
    } else {
      const newProject = {
        id: Date.now(),
        title: formData.title,
        category: formData.category,
        price: Number(formData.price),
        status: "Active",
      };

      setProjectList((previous) => [...previous, newProject]);
    }

    setFormData({
      title: "",
      category: "Electronics",
      price: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // EDIT PROJECT
  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      category: project.category,
      price: String(project.price),
    });

    setEditingId(project.id);
    setShowForm(true);
    setActiveTab("Projects");
  };

  // DELETE PROJECT
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (confirmDelete) {
      setProjectList((previous) =>
        previous.filter((project) => project.id !== id)
      );
    }
  };

  // SEARCH
  const filteredProjects = projectList.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Projects", icon: FolderKanban },
    { name: "Enquiries", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#080711] text-white">

      {/* MOBILE HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#100d1d] p-5 lg:hidden">
        <h1 className="text-xl font-black">
          ECE <span className="text-purple-400">HUB</span>
        </h1>

        <button onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-[#100d1d] p-6 transition-transform lg:static lg:translate-x-0 ${
            mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-12 hidden items-center gap-3 lg:flex">
            <div className="rounded-xl bg-purple-600 p-3">
              <Cpu size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-black">
                ECE <span className="text-purple-400">HUB</span>
              </h1>
              <p className="text-xs tracking-widest text-gray-500">
                ADMIN PANEL
              </p>
            </div>
          </div>

          <p className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-500">
            Main Menu
          </p>

          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setMobileMenu(false);
                  setShowForm(false);
                }}
                className={`flex w-full items-center gap-4 rounded-xl px-5 py-4 text-left transition ${
                  activeTab === item.name
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            ))}
          </div>

          <div className="absolute bottom-8 left-6 right-6">
            <button
              onClick={() => navigate("/")}
              className="mb-3 flex w-full items-center gap-3 rounded-xl px-5 py-3 text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <Eye size={19} />
              View Website
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-5 py-3 text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 p-5 md:p-8 lg:p-10">

          {/* TOP BAR */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">ECE HUB / Admin</p>
              <h2 className="mt-2 text-3xl font-black">
                {activeTab}
              </h2>
            </div>

            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 px-5 py-3">
              <p className="text-xs text-gray-400">Administrator</p>
              <p className="font-bold text-purple-300">Admin Account</p>
            </div>
          </div>

          {/* DASHBOARD TAB */}
          {activeTab === "Dashboard" && (
            <div>

              <div className="mb-10">
                <h3 className="text-2xl font-bold">
                  Welcome to ECE HUB!
                </h3>
                <p className="mt-2 text-gray-400">
                  Manage your projects and customer enquiries.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-white/10 bg-[#151222] p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <FolderKanban className="text-purple-400" size={30} />
                    <TrendingUp className="text-green-400" size={20} />
                  </div>
                  <p className="text-gray-400">Total Projects</p>
                  <h3 className="mt-2 text-4xl font-black">
                    {projectList.length}
                  </h3>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#151222] p-6">
                  <div className="mb-5">
                    <MessageSquare className="text-blue-400" size={30} />
                  </div>
                  <p className="text-gray-400">Total Enquiries</p>
                  <h3 className="mt-2 text-4xl font-black">
                    {enquiries.length}
                  </h3>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#151222] p-6">
                  <div className="mb-5">
                    <IndianRupee className="text-green-400" size={30} />
                  </div>
                  <p className="text-gray-400">Starting Price</p>
                  <h3 className="mt-2 text-4xl font-black">
                    ₹2,000
                  </h3>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#151222] p-6">
                  <div className="mb-5">
                    <Eye className="text-yellow-400" size={30} />
                  </div>
                  <p className="text-gray-400">Active Projects</p>
                  <h3 className="mt-2 text-4xl font-black">
                    {projectList.filter((p) => p.status === "Active").length}
                  </h3>
                </div>

              </div>

              <div className="mt-10 rounded-2xl border border-white/10 bg-[#151222] p-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-bold">Recent Projects</h3>

                  <button
                    onClick={() => setActiveTab("Projects")}
                    className="text-sm font-bold text-purple-400 hover:text-purple-300"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {projectList.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 p-4"
                    >
                      <div>
                        <h4 className="font-bold">{project.title}</h4>
                        <p className="mt-1 text-sm text-gray-400">
                          {project.category}
                        </p>
                      </div>

                      <p className="font-bold text-purple-400">
                        ₹{project.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "Projects" && (
            <div>

              <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">Manage Projects</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Add, edit and delete your project listings.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFormData({
                      title: "",
                      category: "Electronics",
                      price: "",
                    });
                    setEditingId(null);
                    setShowForm(!showForm);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold hover:bg-purple-500"
                >
                  <Plus size={19} />
                  Add Project
                </button>
              </div>

              {/* ADD / EDIT FORM */}
              {showForm && (
                <form
                  onSubmit={handleAddProject}
                  className="mb-8 rounded-2xl border border-purple-500/30 bg-[#151222] p-6"
                >
                  <h3 className="mb-6 text-xl font-bold">
                    {editingId !== null ? "Edit Project" : "Add New Project"}
                  </h3>

                  <label className="mb-2 block text-sm font-semibold">
                    Project Name
                  </label>

                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter project name"
                    className="mb-5 w-full rounded-xl border border-white/10 bg-[#080711] p-4 outline-none focus:border-purple-500"
                  />

                  <label className="mb-2 block text-sm font-semibold">
                    Category
                  </label>

                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mb-5 w-full rounded-xl border border-white/10 bg-[#080711] p-4 outline-none focus:border-purple-500"
                  >
                    <option>Electronics</option>
                    <option>Communication</option>
                    <option>IoT</option>
                    <option>Wireless</option>
                    <option>Embedded Systems</option>
                    <option>Software</option>
                  </select>

                  <label className="mb-2 block text-sm font-semibold">
                    Project Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Enter project price"
                    className="mb-6 w-full rounded-xl border border-white/10 bg-[#080711] p-4 outline-none focus:border-purple-500"
                  />

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="submit"
                      className="rounded-xl bg-purple-600 px-6 py-3 font-bold hover:bg-purple-500"
                    >
                      {editingId !== null ? "Update Project" : "Save Project"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingId(null);
                      }}
                      className="rounded-xl border border-white/20 px-6 py-3"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* SEARCH */}
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-[#151222] px-5 py-4">
                <Search size={20} className="text-purple-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full bg-transparent outline-none"
                />
              </div>

              {/* PROJECT LIST */}
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#151222]">
                <table className="w-full min-w-[650px] text-left">
                  <thead className="border-b border-white/10 bg-white/5 text-sm text-gray-400">
                    <tr>
                      <th className="p-5">Project Name</th>
                      <th className="p-5">Category</th>
                      <th className="p-5">Price</th>
                      <th className="p-5">Status</th>
                      <th className="p-5">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="border-b border-white/5">
                        <td className="p-5 font-semibold">{project.title}</td>
                        <td className="p-5 text-gray-400">{project.category}</td>
                        <td className="p-5 font-bold text-purple-400">
                          ₹{project.price.toLocaleString("en-IN")}
                        </td>
                        <td className="p-5">
                          <span className="rounded-full bg-green-500/10 px-3 py-2 text-xs text-green-400">
                            {project.status}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(project)}
                              title="Edit"
                              className="rounded-lg bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"
                            >
                              <Edit size={18} />
                            </button>

                            <button
                              onClick={() => handleDelete(project.id)}
                              title="Delete"
                              className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredProjects.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-400">
                          No projects found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ENQUIRIES TAB */}
          {activeTab === "Enquiries" && (
            <div className="rounded-2xl border border-white/10 bg-[#151222] p-8 text-center">
              <MessageSquare className="mx-auto mb-5 text-purple-400" size={45} />

              <h3 className="text-2xl font-bold">Customer Enquiries</h3>

              <p className="mx-auto mt-3 max-w-md leading-7 text-gray-400">
                Customer enquiries will appear here after we connect the website
                to a backend database.
              </p>

              <p className="mt-6 rounded-xl bg-purple-500/10 p-4 text-sm text-purple-300">
                No database connected yet.
              </p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
