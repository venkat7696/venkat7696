import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  LogOut,
  X,
  Save,
} from "lucide-react";

const API_URL = "http://localhost:8000";

const emptyForm = {
  title: "",
  category: "",
  price: "",
  image: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [projectList, setProjectList] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FETCH PROJECTS FROM MONGODB
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/projects`);

      if (!response.ok) {
        throw new Error("Unable to fetch projects");
      }

      const data = await response.json();

      setProjectList(data);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed. Check whether FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // INPUT CHANGE
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // IMAGE UPLOAD
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setImageError("Image must be smaller than 1 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setFormData((previous) => ({
        ...previous,
        image: reader.result,
      }));

      setImageError("");
    };

    reader.onerror = () => {
      setImageError("Unable to read image.");
    };

    reader.readAsDataURL(file);
  };

  // OPEN ADD FORM
  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setImageError("");
    setShowForm(true);
  };

  // EDIT PROJECT
  const handleEdit = (project) => {
    setEditingId(project.id);

    setFormData({
      title: project.title || "",
      category: project.category || "",
      price: project.price ?? "",
      image: project.image || "",
    });

    setImageError("");
    setShowForm(true);
  };

  // ADD OR UPDATE PROJECT IN MONGODB
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      alert("Enter project name.");
      return;
    }

    if (!formData.category.trim()) {
      alert("Enter project category.");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      alert("Enter a valid price.");
      return;
    }

    const projectData = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      image: formData.image,
      description: "",
      technology: "",
    };

    try {
      setSaving(true);

      let response;

      if (editingId !== null) {
        response = await fetch(
          `${API_URL}/projects/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(projectData),
          }
        );
      } else {
        response = await fetch(`${API_URL}/projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Project save failed");
      }

      alert(
        editingId !== null
          ? "Project updated successfully!"
          : "Project added successfully!"
      );

      setShowForm(false);
      setFormData(emptyForm);
      setEditingId(null);

      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE PROJECT FROM MONGODB
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/projects/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Delete failed");
      }

      alert("Project deleted successfully!");

      await fetchProjects();
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to delete project.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem("ecehubAdminDemo");
    navigate("/admin");
  };

  // SEARCH
  const filteredProjects = projectList.filter((project) =>
    `${project.title} ${project.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080711] text-white">

      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#100e1d] px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-600 p-3">
              <LayoutDashboard size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold">ECE HUB Admin</h1>
              <p className="text-xs text-gray-400">
                Project Management
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 hover:bg-white/10"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10">

        {/* TITLE */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="mt-2 text-gray-400">
              Manage your ECE HUB projects.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-500"
          >
            <Plus size={20} />
            Add New Project
          </button>

        </div>

        {/* STATISTICS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-[#151322] p-6">
            <p className="text-sm text-gray-400">Total Projects</p>
            <p className="mt-2 text-3xl font-bold">
              {projectList.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#151322] p-6">
            <p className="text-sm text-gray-400">
              Project Categories
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                new Set(
                  projectList.map((project) => project.category)
                ).size
              }
            </p>
          </div>

        </div>

        {/* SEARCH */}
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search projects..."
          className="mb-5 w-full rounded-xl border border-white/10 bg-[#151322] px-4 py-3 outline-none focus:border-purple-500 md:max-w-md"
        />

        {/* PROJECT TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#151322]">

          <table className="w-full min-w-[700px] text-left">

            <thead className="bg-white/5 text-sm text-gray-300">
              <tr>
                <th className="px-5 py-5">Project Name</th>
                <th className="px-5 py-5">Category</th>
                <th className="px-5 py-5">Price</th>
                <th className="px-5 py-5">Status</th>
                <th className="px-5 py-5">Actions</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="5" className="px-5 py-10 text-center text-gray-400">
                    Loading projects...
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (

                  <tr
                    key={project.id}
                    className="border-t border-white/10 text-sm"
                  >

                    <td className="px-5 py-5 font-semibold">
                      {project.title}
                    </td>

                    <td className="px-5 py-5 text-gray-300">
                      {project.category}
                    </td>

                    <td className="px-5 py-5 font-bold text-pink-400">
                      ₹{Number(project.price).toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-5">
                      <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs text-green-400">
                        Active
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex gap-2">

                        <button
                          onClick={() => handleEdit(project)}
                          className="rounded-lg bg-sky-500/15 p-2 text-sky-400 hover:bg-sky-500/30"
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(project.id)}
                          className="rounded-lg bg-red-500/15 p-2 text-red-400 hover:bg-red-500/30"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>
                    </td>

                  </tr>

                ))
              )}

              {!loading && filteredProjects.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-gray-400"
                  >
                    No projects found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>

        </div>

      </main>

      {/* ADD / EDIT MODAL */}
      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4">

          <div className="my-6 w-full max-w-xl rounded-2xl border border-white/10 bg-[#151322] p-6">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                {editingId !== null ? "Edit Project" : "Add New Project"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10"
              >
                <X size={22} />
              </button>

            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* PROJECT NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Project Name
                </label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#080711] px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Example: IoT, Electronics"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#080711] px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              {/* PRICE */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Price (₹)
                </label>

                <input
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter project price"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#080711] px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              {/* IMAGE UPLOAD */}
              <div>
                <label className="mb-3 block text-sm font-semibold">
                  Project Image
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-purple-500/40 bg-[#080711] p-8 text-center hover:border-purple-400">

                  <ImagePlus
                    size={40}
                    className="mb-3 text-purple-400"
                  />

                  <span className="font-semibold">
                    Click to upload project image
                  </span>

                  <span className="mt-2 text-xs text-gray-400">
                    JPG, PNG or WEBP · Maximum 1 MB
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                </label>

                {imageError && (
                  <p className="mt-2 text-sm text-red-400">
                    {imageError}
                  </p>
                )}

                {/* IMAGE PREVIEW */}
                {formData.image && (
                  <div className="mt-4">

                    <p className="mb-2 text-sm text-gray-400">
                      Image Preview
                    </p>

                    <img
                      src={formData.image}
                      alt="Project Preview"
                      className="h-48 w-full rounded-xl border border-white/10 object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((previous) => ({
                          ...previous,
                          image: "",
                        }))
                      }
                      className="mt-2 text-sm text-red-400 hover:text-red-300"
                    >
                      Remove Image
                    </button>

                  </div>
                )}

              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-semibold hover:bg-purple-500 disabled:opacity-50"
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Project"
                    : "Save Project"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}