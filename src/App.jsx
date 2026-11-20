import React, { useState, useEffect } from "react";
import {
  Cpu,
  Code,
  ArrowRight,
  Zap,
  Menu,
  X,
  Bot,
  Smartphone,
  MessageCircle,
  Calculator,
  Rocket,
  ShieldCheck,
  Search,
  Send,
  Layers,
  CheckCircle
} from "lucide-react";

// DEFAULT PROJECTS WITH YOUR PHOTOS
const defaultProjects = [
  {
    id: 1,
    title: "Automatic Adjustable Table",
    category: "Electronics & Automation",
    price: 2000,
    image: "/projects/Automatic-adjustable-table.jpeg",
    description: "An automatic adjustable table designed using electronics and automation technology.",
    technology: "Arduino, Motors, Sensors"
  },
  {
    id: 2,
    title: "Bluetooth Jammer",
    category: "Communication Systems",
    price: 2500,
    image: "/projects/bluetooth-jamer.jpeg",
    description: "A communication-systems demonstration project.",
    technology: "Communication Systems, Electronics"
  },
  {
    id: 3,
    title: "Smart Health Monitoring System",
    category: "IoT & Healthcare",
    price: 3000,
    image: "/projects/health-monitoring-system.jpeg",
    description: "An IoT-based healthcare monitoring project.",
    technology: "ESP32, Sensors, IoT"
  },
  {
    id: 4,
    title: "LoRa Communication Board",
    category: "Wireless Communication",
    price: 2000,
    image: "/projects/lora-communication-board-1.jpeg",
    description: "A wireless communication project using LoRa technology.",
    technology: "LoRa, Embedded Systems"
  },
  {
    id: 5,
    title: "Smart Traffic Management",
    category: "IoT & Embedded Systems",
    price: 3000,
    image: "/projects/smart-traffic-sysrem.jpeg",
    description: "An intelligent traffic management prototype.",
    technology: "Arduino, Sensors, Embedded Systems"
  },
  {
    id: 6,
    title: "Smart Weather Monitoring",
    category: "IoT & Sensors",
    price: 2000,
    image: "/projects/smart-weather-monitoring-system.jpeg",
    description: "A smart weather monitoring system using sensors.",
    technology: "ESP32, Sensors, IoT"
  },
  {
    id: 7,
    title: "Smart Workbench ESP32",
    category: "Embedded Systems",
    price: 2500,
    image: "/projects/smart-workbench-esp32.jpeg",
    description: "An ESP32-based smart workbench prototype.",
    technology: "ESP32, Embedded Systems"
  }
];

const whatsappNumber = "919963047203";
const API_URL = "http://localhost:8000";

function App() {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [projectType, setProjectType] = useState("Electronics Project");
  const [budget, setBudget] = useState("2000");
  const [customerName, setCustomerName] = useState("");
  const [customerMessage, setCustomerMessage] = useState("");

  // LOAD PROJECTS FROM FASTAPI / MONGODB
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setProjectsLoading(true);
        setProjectsError("");

        const response = await fetch(`${API_URL}/projects`);

        if (!response.ok) {
          throw new Error(`Projects API returned ${response.status}`);
        }

        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Unable to load projects from MongoDB:", error);
        setProjectsError("Unable to load projects. Please check that the ECE HUB backend is running.");
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // CREATE CATEGORY LIST AUTOMATICALLY
  const categories = [
    "All",
    ...new Set(
      projects.map((project) => project.category || "Other")
    )
  ];

  // SEARCH AND FILTER
  const filteredProjects = projects.filter((project) => {
    const title = project.title || "";
    const category = project.category || "Other";

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // WHATSAPP CONTACT
  const sendWhatsApp = (message) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // PROJECT ENQUIRY
  const enquireProject = (project) => {
    sendWhatsApp(
      `Hello ECE HUB!\n\nI am interested in this project:\nProject: ${project.title}\nStarting Price: ₹${project.price}\n\nPlease share more details.`
    );
  };

  // CUSTOM PROJECT REQUEST
  const submitRequest = (e) => {
    e.preventDefault();

    if (!customerName.trim() || !customerMessage.trim()) {
      alert("Please fill in all required details.");
      return;
    }

    sendWhatsApp(
      `Hello ECE HUB!\n\nName: ${customerName}\nProject Type: ${projectType}\nBudget: ₹${budget}\nQuantity: ${quantity}\nRequirements: ${customerMessage}`
    );
  };

  return (
    <div className="min-h-screen bg-[#080711] text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#080711]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <a href="#home" className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-600 p-2">
              <Cpu size={25} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-wide">
                ECE <span className="text-purple-400">HUB</span>
              </h1>
              <p className="text-[10px] tracking-widest text-gray-400">
                ENGINEERING SOLUTIONS
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex">
            <a href="#home" className="hover:text-purple-400">Home</a>
            <a href="#projects" className="hover:text-purple-400">Projects</a>
            <a href="#services" className="hover:text-purple-400">Services</a>
            <a href="#estimator" className="hover:text-purple-400">Pricing</a>
            <a href="#contact" className="hover:text-purple-400">Contact</a>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-purple-600 px-5 py-3 text-sm font-bold transition hover:bg-purple-500 md:block"
          >
            Let's Talk <ArrowRight className="ml-2 inline" size={16} />
          </a>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden">
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenu && (
          <div className="flex flex-col gap-5 border-t border-white/10 bg-[#100d1d] p-6 md:hidden">
            <a href="#home" onClick={() => setMobileMenu(false)}>Home</a>
            <a href="#projects" onClick={() => setMobileMenu(false)}>Projects</a>
            <a href="#services" onClick={() => setMobileMenu(false)}>Services</a>
            <a href="#estimator" onClick={() => setMobileMenu(false)}>Pricing</a>
            <a href="#contact" onClick={() => setMobileMenu(false)}>Contact</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden px-6 py-28 md:py-36">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-purple-700/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">

          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
              <Zap size={16} />
              Engineering Ideas into Reality
            </div>

            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              Build Your
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Dream Project
              </span>
              With Us.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">
              We transform innovative engineering ideas into real-world
              electronics, IoT and software solutions.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a href="#projects" className="rounded-full bg-purple-600 px-7 py-4 font-bold transition hover:bg-purple-500">
                Explore Projects <ArrowRight className="ml-2 inline" size={18} />
              </a>

              <a href="#contact" className="rounded-full border border-white/20 px-7 py-4 font-bold transition hover:border-purple-400">
                Contact Us
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-8">
              <div>
                <h3 className="text-3xl font-black text-purple-400">{projects.length}+</h3>
                <p className="text-sm text-gray-400">Project Showcases</p>
              </div>
              <div>
                <h3 className="text-3xl font-black text-purple-400">IoT</h3>
                <p className="text-sm text-gray-400">Smart Solutions</p>
              </div>
              <div>
                <h3 className="text-3xl font-black text-purple-400">24/7</h3>
                <p className="text-sm text-gray-400">Online Enquiry</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-600/20 to-blue-600/10 p-8 shadow-2xl shadow-purple-900/20">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">ECE HUB</p>
                <h2 className="mt-1 text-2xl font-bold">Innovation Lab</h2>
              </div>
              <Cpu size={45} className="text-purple-400" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Cpu, title: "Electronics", subtitle: "Hardware Design" },
                { icon: Code, title: "Software", subtitle: "Web Development" },
                { icon: Bot, title: "Automation", subtitle: "Smart Systems" },
                { icon: Smartphone, title: "IoT", subtitle: "Connected Devices" }
              ].map((item, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-black/30 p-6 transition hover:border-purple-400">
                  <item.icon size={30} className="mb-4 text-purple-400" />
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-xs text-gray-400">{item.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-purple-500/20 bg-purple-500/10 p-4 text-center text-sm text-purple-300">
              Engineering Ideas into Reality.
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-[#0e0c19] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="font-bold uppercase tracking-widest text-purple-400">What We Do</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Our Services</h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-400">
              Complete engineering solutions for students, innovators and businesses.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Cpu, title: "Electronics Projects", desc: "Embedded systems, automation and hardware prototypes." },
              { icon: Code, title: "Software Development", desc: "Web applications, software solutions and dashboards." },
              { icon: Bot, title: "IoT & AI Solutions", desc: "Smart monitoring, connected devices and intelligent systems." },
              { icon: Smartphone, title: "Mobile Applications", desc: "Mobile application development and integrations." },
              { icon: Rocket, title: "Project Development", desc: "Custom engineering project development and guidance." },
              { icon: ShieldCheck, title: "Technical Support", desc: "Project assistance, testing and troubleshooting." }
            ].map((service, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-[#151222] p-8 transition hover:-translate-y-2 hover:border-purple-500/50">
                <service.icon size={38} className="mb-6 text-purple-400" />
                <h3 className="mb-3 text-xl font-bold">{service.title}</h3>
                <p className="leading-7 text-gray-400">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT GALLERY */}
      <section id="projects" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <p className="font-bold uppercase tracking-widest text-purple-400">Our Work</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Featured Projects</h2>
            <p className="mt-4 text-gray-400">
              Explore our electronics, IoT and embedded systems projects.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mx-auto mb-8 max-w-xl">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#151222] px-5 py-4 focus-within:border-purple-500">
              <Search className="text-purple-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-5 py-3 text-sm transition ${
                  selectedCategory === category
                    ? "border-purple-500 bg-purple-600 text-white"
                    : "border-white/10 bg-[#151222] text-gray-400 hover:border-purple-400 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* PROJECT LOADING / ERROR STATUS */}
          {projectsLoading && (
            <p className="py-8 text-center text-gray-400">Loading projects...</p>
          )}

          {!projectsLoading && projectsError && (
            <p className="py-8 text-center text-red-400">{projectsError}</p>
          )}

          {/* PROJECT CARDS */}
          {!projectsLoading && !projectsError && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <div key={project.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-[#151222] transition hover:-translate-y-2 hover:border-purple-500/50">

                  <div className="relative h-56 overflow-hidden bg-[#211b32]">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Cpu size={55} className="text-purple-400" />
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-purple-600 px-3 py-2 text-xs font-bold">
                      {project.category || "Other"}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold">{project.title}</h3>

                    <p className="mt-3 text-sm text-gray-400">
                      {project.description || "Contact us for more project details."}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Starting from</p>
                        <p className="text-xl font-black text-purple-400">
                          ₹{Number(project.price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="rounded-full bg-white/10 p-3 transition hover:bg-purple-600"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>

                    <button
                      onClick={() => enquireProject(project)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-500/40 py-3 font-bold text-purple-300 transition hover:bg-purple-600 hover:text-white"
                    >
                      <MessageCircle size={18} />
                      Enquire on WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!projectsLoading && !projectsError && filteredProjects.length === 0 && (
            <div className="py-16 text-center">
              <Search className="mx-auto mb-4 text-gray-500" size={40} />
              <h3 className="text-xl font-bold">No Projects Found</h3>
              <p className="mt-2 text-gray-400">Try another search or category.</p>
            </div>
          )}
        </div>
      </section>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-5 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-purple-500/30 bg-[#151222]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64">
              {selectedProject.image ? (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#211b32]">
                  <Cpu size={55} className="text-purple-400" />
                </div>
              )}

              <button
                onClick={() => setSelectedProject(null)}
                className="absolute right-4 top-4 rounded-full bg-black/70 p-2"
              >
                <X />
              </button>
            </div>

            <div className="p-7">
              <p className="text-sm text-purple-400">
                {selectedProject.category}
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {selectedProject.title}
              </h2>

              <p className="mt-4 leading-7 text-gray-400">
                {selectedProject.description || "Contact us for more details."}
              </p>

              {selectedProject.technology && (
                <div className="mt-5 rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-gray-400">Technologies</p>
                  <p className="mt-2 font-semibold">
                    {selectedProject.technology}
                  </p>
                </div>
              )}

              <p className="mt-5 text-2xl font-black text-purple-400">
                ₹{Number(selectedProject.price || 0).toLocaleString("en-IN")} onwards
              </p>

              <button
                onClick={() => enquireProject(selectedProject)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 font-bold hover:bg-purple-500"
              >
                <MessageCircle size={20} />
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRICE ESTIMATOR */}
      <section id="estimator" className="bg-[#0e0c19] px-6 py-24">
        <div className="mx-auto max-w-5xl">

          <div className="mb-12 text-center">
            <p className="font-bold uppercase tracking-widest text-purple-400">Estimate Your Budget</p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">Project Cost Estimator</h2>
            <p className="mt-4 text-gray-400">Share your project requirements and get a quotation.</p>
          </div>

          <div className="grid gap-8 rounded-3xl border border-white/10 bg-[#151222] p-8 md:grid-cols-2 md:p-12">

            <div>
              <label className="mb-3 block font-semibold">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080711] p-4 text-white outline-none focus:border-purple-500"
              >
                <option>Electronics Project</option>
                <option>IoT Project</option>
                <option>Embedded Systems</option>
                <option>Software Development</option>
                <option>Mobile Application</option>
                <option>AI & Machine Learning</option>
                <option>Custom Project</option>
              </select>

              <label className="mb-3 mt-7 block font-semibold">Estimated Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#080711] p-4 text-white outline-none focus:border-purple-500"
              >
                <option value="2000">₹2,000 - ₹5,000</option>
                <option value="5000">₹5,000 - ₹10,000</option>
                <option value="10000">₹10,000 - ₹20,000</option>
                <option value="20000">₹20,000 - ₹50,000</option>
                <option value="50000">Above ₹50,000</option>
              </select>

              <label className="mb-3 mt-7 block font-semibold">Quantity</label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-white/10 bg-[#080711] p-4 text-white outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-purple-500/30 bg-purple-500/10 p-8">
              <Calculator size={45} className="mb-6 text-purple-400" />
              <p className="text-gray-400">Selected Budget Range</p>

              <h3 className="mt-3 text-4xl font-black text-purple-400">
                ₹{(Number(budget) * quantity).toLocaleString("en-IN")}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                This is an indicative budget selection, not a final quotation.
                Final cost depends on project requirements and components.
              </p>

              <button
                onClick={() => sendWhatsApp(
                  `Hello ECE HUB!\nI need a project quotation.\nProject Type: ${projectType}\nBudget: ₹${budget}\nQuantity: ${quantity}`
                )}
                className="mt-7 rounded-xl bg-purple-600 py-4 font-bold transition hover:bg-purple-500"
              >
                Get Final Quotation <ArrowRight className="ml-2 inline" size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM PROJECT REQUEST */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">

          <div className="mb-12 text-center">
            <p className="font-bold uppercase tracking-widest text-purple-400">Have an Idea?</p>
            <h2 className="mt-4 text-4xl font-black">Request a Custom Project</h2>
            <p className="mt-4 text-gray-400">
              Tell us your idea. Let's build something innovative together.
            </p>
          </div>

          <form onSubmit={submitRequest} className="rounded-3xl border border-white/10 bg-[#151222] p-8 md:p-10">

            <label className="mb-3 block font-semibold">Your Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="mb-6 w-full rounded-xl border border-white/10 bg-[#080711] p-4 outline-none focus:border-purple-500"
            />

            <label className="mb-3 block font-semibold">Project Type</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="mb-6 w-full rounded-xl border border-white/10 bg-[#080711] p-4 outline-none focus:border-purple-500"
            >
              <option>Electronics Project</option>
              <option>IoT Project</option>
              <option>Embedded Systems</option>
              <option>Software Development</option>
              <option>Mobile Application</option>
              <option>AI & Machine Learning</option>
              <option>Custom Project</option>
            </select>

            <label className="mb-3 block font-semibold">Project Requirements *</label>
            <textarea
              required
              rows="5"
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              placeholder="Describe your project idea..."
              className="mb-6 w-full resize-none rounded-xl border border-white/10 bg-[#080711] p-4 outline-none focus:border-purple-500"
            />

            <label className="mb-3 block font-semibold">Your Budget</label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mb-8 w-full rounded-xl border border-white/10 bg-[#080711] p-4 outline-none focus:border-purple-500"
            >
              <option value="2000">₹2,000 - ₹5,000</option>
              <option value="5000">₹5,000 - ₹10,000</option>
              <option value="10000">₹10,000 - ₹20,000</option>
              <option value="20000">₹20,000 - ₹50,000</option>
              <option value="50000">Above ₹50,000</option>
            </select>

            <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-xl bg-purple-600 py-4 font-bold transition hover:bg-purple-500">
              <Send size={19} />
              Submit Project Request
            </button>
          </form>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#0e0c19] px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-bold uppercase tracking-widest text-purple-400">Why ECE HUB</p>
          <h2 className="mt-4 text-4xl font-black">Engineering Made Simple</h2>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: CheckCircle, title: "Quality Projects", desc: "Practical engineering solutions and project demonstrations." },
              { icon: Layers, title: "Multiple Technologies", desc: "Electronics, IoT, embedded systems and software." },
              { icon: ShieldCheck, title: "Direct Support", desc: "Discuss your requirements directly with our team." }
            ].map((item, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-[#151222] p-8">
                <item.icon className="mx-auto mb-5 text-purple-400" size={40} />
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-700/20 to-blue-700/10 p-10 text-center md:p-16">
          <p className="font-bold uppercase tracking-widest text-purple-400">Let's Connect</p>
          <h2 className="mt-5 text-4xl font-black md:text-5xl">Have a Project Idea?</h2>
          <p className="mx-auto mt-5 max-w-xl leading-8 text-gray-400">
            Let's discuss your idea and turn it into a real engineering solution.
            Contact ECE HUB today.
          </p>

          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-green-600 px-8 py-4 font-bold transition hover:bg-green-500"
          >
            <MessageCircle size={22} />
            Chat on WhatsApp
          </a>

          <p className="mt-6 text-sm text-gray-400">WhatsApp: +91 99630 47203</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#05040a] px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 md:flex-row">
          <div>
            <h2 className="text-2xl font-black">
              ECE <span className="text-purple-400">HUB</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500">Engineering Ideas into Reality.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <a href="#home" className="hover:text-purple-400">Home</a>
            <a href="#projects" className="hover:text-purple-400">Projects</a>
            <a href="#services" className="hover:text-purple-400">Services</a>
            <a href="#contact" className="hover:text-purple-400">Contact</a>
          </div>

          <p className="text-sm text-gray-500">© 2026 ECE HUB. All rights reserved.</p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 rounded-full bg-green-600 p-4 shadow-lg shadow-green-900/30 transition hover:scale-110 hover:bg-green-500"
        aria-label="Contact ECE HUB on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>

    </div>
  );
}

export default App;