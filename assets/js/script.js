/**
 * Fahmi Andriansyah — Company Profile & Tech Solutions
 * Inspired by cargo.xpdc.co.id aesthetic & interaction architecture
 */

// --- 1. PRELOADER ANTI-NYANGKUT ---
const hidePreloader = () => {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('hide')) {
    preloader.classList.add('hide');
    document.body.classList.remove('loading-locked');
  }
};
window.addEventListener('load', () => setTimeout(hidePreloader, 350));
document.addEventListener('DOMContentLoaded', () => setTimeout(hidePreloader, 1200));
setTimeout(hidePreloader, 2200);

// --- 2. SCROLL REVEAL OBSERVER ---
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- 3. THREE.JS 3D PARALLAX BACKGROUND ---
let threeMaterial, threePlane, threeRenderer, threeScene, threeCamera;
try {
  const canvas = document.getElementById('webgl-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    threeRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const geometry = new THREE.PlaneGeometry(36, 24, 45, 45);
    const isInitialDark = document.documentElement.classList.contains('dark');
    threeMaterial = new THREE.MeshBasicMaterial({
      color: isInitialDark ? 0x06b6d4 : 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: isInitialDark ? 0.22 : 0.15
    });

    threePlane = new THREE.Mesh(geometry, threeMaterial);
    threePlane.rotation.x = -Math.PI / 2.7;
    threePlane.position.y = -2.2;
    threeScene.add(threePlane);
    threeCamera.position.z = 5.2;

    const clock = new THREE.Clock();
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animateThree() {
      requestAnimationFrame(animateThree);
      const time = clock.getElapsedTime();
      const pos = threePlane.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        pos.setZ(i, Math.sin(x * 0.45 + time * 0.9) * Math.cos(y * 0.45 + time * 0.8) * 1.35);
      }
      pos.needsUpdate = true;
      threeCamera.position.x += (mouseX * 0.6 - threeCamera.position.x) * 0.05;
      threeCamera.position.y += (mouseY * 0.4 - (window.scrollY * 0.0018) - threeCamera.position.y) * 0.05;
      threeCamera.lookAt(threeScene.position);
      threeRenderer.render(threeScene, threeCamera);
    }
    animateThree();

    window.addEventListener('resize', () => {
      threeCamera.aspect = window.innerWidth / window.innerHeight;
      threeCamera.updateProjectionMatrix();
      threeRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
} catch (err) {
  console.warn("Three.js initialization skipped:", err);
}

// --- 4. THEME MANAGEMENT (DARK / LIGHT) ---
const currentTheme = localStorage.getItem('theme');
const initTheme = () => {
  const isDark = currentTheme === 'dark' || (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    document.documentElement.classList.add('dark');
    if (threeMaterial) {
      threeMaterial.color.setHex(0x06b6d4);
      threeMaterial.opacity = 0.22;
    }
  } else {
    document.documentElement.classList.remove('dark');
    if (threeMaterial) {
      threeMaterial.color.setHex(0x2563eb);
      threeMaterial.opacity = 0.15;
    }
  }
  updateThemeIcons();
};

const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  if (threeMaterial) {
    threeMaterial.color.setHex(isDark ? 0x06b6d4 : 0x2563eb);
    threeMaterial.opacity = isDark ? 0.22 : 0.15;
  }
  updateThemeIcons();
};

const updateThemeIcons = () => {
  const isDark = document.documentElement.classList.contains('dark');
  const themeBtns = document.querySelectorAll('.theme-toggle-btn');
  themeBtns.forEach(btn => {
    btn.innerHTML = isDark
      ? `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
      : `<svg class="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
  });
};

initTheme();

// --- 5. MULTI-LANGUAGE SYSTEM (ID / EN) ---
let currentLang = localStorage.getItem('lang') || 'id';
const dict = {
  id: {
    tagline: "#IndustrialIoT · #SmartManufacturing · #OTITSecurity",
    hero_title_1: "Solusi Cerdas & Rekayasa",
    hero_title_2: "Industrial IoT & Smart Factory.",
    hero_desc: "Maydef menghadirkan solusi teknologi terpadu: integrasi mesin pabrik, telemetri nirkabel LoRa/Modbus, arsitektur OT/IT berbasis ISA-95, serta standar keamanan siber IEC 62443 untuk transformasi industri Anda.",
    hero_btn_explore: "Eksplorasi Layanan",
    hero_btn_contact: "Konsultasi Sekarang",
    nav_about: "Tentang Kami",
    nav_services: "Layanan & Solusi",
    nav_portfolio: "Portofolio",
    nav_advantages: "Keunggulan",
    nav_cert: "Sertifikasi",
    nav_contact: "Kontak",
    calc_badge: "ESTIMASI SOLUSI PROYEK",
    calc_title: "Konsultasikan Kebutuhan Industri & IT Anda",
    calc_desc: "Pilih kategori layanan dan skala implementasi untuk mendapatkan ringkasan ruang lingkup kerja serta penawaran langsung.",
    calc_service_lbl: "Pilih Kategori Solusi:",
    calc_scale_lbl: "Skala Implementasi:",
    calc_btn: "Dapatkan Estimasi & Konsultasi",
    srv_title: "Layanan & Solusi Unggulan",
    srv_sub: "Kapabilitas rekayasa menyeluruh dari sensor fisik di lantai pabrik hingga dashboard analitik berbasis cloud.",
    port_title: "Portofolio & Studi Kasus Proyek",
    port_sub: "Implementasi nyata sistem monitoring, efisiensi manufaktur, dan keamanan OT/IT di lingkungan produksi.",
    filter_all: "Semua Proyek",
    filter_manufacturing: "Smart Manufacturing",
    filter_iiot: "Industrial IoT & Hardware",
    filter_security: "Cybersecurity & Standard",
    filter_software: "Platform & Monitoring"
  },
  en: {
    tagline: "#IndustrialIoT · #SmartManufacturing · #OTITSecurity",
    hero_title_1: "Smart Engineering Solutions for",
    hero_title_2: "Industrial IoT & Smart Factory.",
    hero_desc: "Maydef provides integrated engineering solutions: shop-floor machine telemetry, LoRa/Modbus wireless networks, ISA-95 OT/IT architectures, and IEC 62443 cybersecurity standards to empower your digital transformation.",
    hero_btn_explore: "Explore Services",
    hero_btn_contact: "Get in Touch",
    nav_about: "About Us",
    nav_services: "Services & Solutions",
    nav_portfolio: "Portfolio",
    nav_advantages: "Advantages",
    nav_cert: "Certifications",
    nav_contact: "Contact",
    calc_badge: "PROJECT SOLUTION ESTIMATOR",
    calc_title: "Consult Your Industrial & IT Requirements",
    calc_desc: "Select a solution category and deployment scale to get an instant scope breakdown and direct consultation proposal.",
    calc_service_lbl: "Select Solution Category:",
    calc_scale_lbl: "Deployment Scale:",
    calc_btn: "Get Scope & Consult",
    srv_title: "Core Services & Solutions",
    srv_sub: "End-to-end engineering capabilities spanning physical shop floor sensors to cloud-native analytical platforms.",
    port_title: "Selected Projects & Case Studies",
    port_sub: "Production-grade implementations across manufacturing efficiency, industrial telemetry, and secure architectures.",
    filter_all: "All Projects",
    filter_manufacturing: "Smart Manufacturing",
    filter_iiot: "Industrial IoT & Hardware",
    filter_security: "Cybersecurity & Standards",
    filter_software: "Platform & Monitoring"
  }
};

const toggleLang = () => {
  currentLang = currentLang === 'id' ? 'en' : 'id';
  localStorage.setItem('lang', currentLang);
  updateLangUI();
};

const updateLangUI = () => {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[currentLang] && dict[currentLang][key]) {
      el.innerHTML = dict[currentLang][key];
    }
  });
  const langBadges = document.querySelectorAll('.lang-toggle-text');
  langBadges.forEach(b => {
    b.innerText = currentLang === 'id' ? 'EN' : 'ID';
  });
};

updateLangUI();

// --- 6. DETAILED SERVICES DATA & MODALS ---
const serviceDetails = {
  iiot: {
    title: "Industrial IoT & Machine Telemetry",
    tagline: "Dari Sensor Fisik ke Aliran Data Digital Real-Time",
    icon: "cpu-chip",
    overview: "Pemasangan dan integrasi perangkat edge (ESP32, Raspberry Pi, Industrial Gateway) untuk menangkap data operasional mesin dan lingkungan fisik secara nirkabel dan kabel (Modbus RTU/TCP, LoRaWAN, RS485).",
    deliverables: [
      "Akuisisi data analog & digital (tegangan, getaran, suhu, kelembaban, arus, counter)",
      "Protokol komunikasi industri (Modbus RTU, MQTT over TLS, LoRaWAN 915/920MHz)",
      "Edge gateway processing & offline buffering saat koneksi terputus",
      "Skema integrasi hardware aman dengan proteksi optocoupler & surge protection"
    ],
    tech: ["ESP32", "Raspberry Pi 4", "LoRaWAN", "Modbus RTU/TCP", "MQTT", "Python MicroPython"],
    timeline: "2 – 4 Minggu per Lini Produksi"
  },
  manufacturing: {
    title: "Smart Manufacturing & Digital Shop Floor",
    tagline: "Visibilitas OEE, Digital Andon, dan Efisiensi Produksi",
    icon: "chart-bar",
    overview: "Digitalisasi lantai pabrik dengan sistem OEE (Overall Equipment Effectiveness) otomatis, sistem panggilan Andon digital terpadu, dan pelacakan pergerakan aset untuk memangkas downtime secara drastis.",
    deliverables: [
      "Kalkulasi OEE otomatis (Availability, Performance, Quality)",
      "Digital Andon System dengan eskalasi panggilan via Web & Mobile Notification",
      "RFID Pallet Tracking & deteksi otomatis cycle-time produksi",
      "Dashboard monitor stasiun kerja interaktif untuk operator & supervisor"
    ],
    tech: ["Laravel", "Node.js", "WebSockets", "RFID", "PostgreSQL", "Tailwind CSS"],
    timeline: "3 – 6 Minggu implementasi sistem"
  },
  otit: {
    title: "OT/IT Architecture & Integration",
    tagline: "Standardisasi ISA-95 & Purdue Enterprise Reference Architecture",
    icon: "server-stack",
    overview: "Menjembatani batas antara jaringan operasional pabrik (OT) dan jaringan enterprise IT bisnis secara terstruktur, terdokumentasi, dan terisolasi dengan standar ISA-95 Level 0 hingga Level 4.",
    deliverables: [
      "Pemetaan Purdue Model & segmentasi zona firewall (IDMZ, Cell/Area Zone)",
      "API Middleware penghubung PLC/SCADA ke sistem ERP / MES",
      "Sentralisasi data historian dengan InfluxDB & TimescaleDB",
      "Dokumentasi arsitektur enterprise & Standar Operasional Prosedur (SOP) integrasi"
    ],
    tech: ["ISA-95", "Purdue Model", "Docker", "REST API", "InfluxDB", "Linux Hardening"],
    timeline: "3 – 5 Minggu per plant"
  },
  security: {
    title: "Industrial Cybersecurity & OT Hardening",
    tagline: "Proteksi Aset Kritis berdasarkan IEC 62443 & ISO/IEC 27001",
    icon: "shield-check",
    overview: "Audit kerentanan keamanan siber untuk infrastruktur industri dan aplikasi pendukung. Menjamin jalur komunikasi mesin tidak menjadi titik celah intrusi berbahaya ke jaringan enterprise.",
    deliverables: [
      "Vulnerability Assessment & Penetration Testing (VAPT) untuk API & Web Platform",
      "Review arsitektur keamanan OT/IT sesuai standar IEC 62443",
      "Hardening sistem operasi Linux, edge router, dan container Docker",
      "Penerapan otentikasi mTLS, enkripsi data in-transit, dan manajemen rahasia (secrets)"
    ],
    tech: ["IEC 62443", "ISO 27001", "CEH Methodologies", "AppSec", "Wireshark", "OpenVAS / Nessus"],
    timeline: "1 – 3 Minggu per audit"
  },
  platform: {
    title: "Custom Platform & Web Dashboard",
    tagline: "Aplikasi Web Perusahaan & Sistem Informasi Kustom",
    icon: "globe-alt",
    overview: "Pengembangan software custom berbasis web enterprise untuk monitoring, pelaporan produksi, manajemen inventaris industri, dan integrasi multi-cabang dengan performa tinggi.",
    deliverables: [
      "Aplikasi full-stack performa tinggi menggunakan Laravel & Node.js modern",
      "User interface responsif, intuitif, dan ramah pengguna di berbagai perangkat",
      "Manajemen akses bertingkat (Role-Based Access Control / RBAC)",
      "Ekspor laporan otomatis (PDF/Excel) & log audit aktivitas pengguna"
    ],
    tech: ["Laravel", "Node.js / Express", "PostgreSQL / MySQL", "Redis", "Docker", "RESTful API"],
    timeline: "3 – 6 Minggu"
  },
  monitoring: {
    title: "Predictive Maintenance & Telemetry Observability",
    tagline: "Deteksi Dini Anomali Mesin & Visualisasi Real-Time Grafana",
    icon: "eye",
    overview: "Observabilitas menyeluruh untuk aset industri melalui analisis spektrum getaran, fluktuasi tekanan, lonjakan daya listrik, dan monitoring metrik server 24/7 menggunakan stack Prometheus & Grafana.",
    deliverables: [
      "Sensor monitoring getaran & suhu permukaan mesin berkelanjutan",
      "Dashboard visualisasi interaktif multi-parameter di Grafana",
      "Sistem alarm dini otomatis (Telegram Bot, WhatsApp, Email alert)",
      "Logging time-series dengan retensi data tinggi untuk analisis tren keausan mesin"
    ],
    tech: ["Prometheus", "Grafana", "InfluxDB", "Telegraf", "Python Analytics", "Modbus Power Meters"],
    timeline: "2 – 4 Minggu"
  }
};

window.openServiceModal = (key) => {
  const s = serviceDetails[key];
  if (!s) return;

  const techPills = s.tech.map(t => `<span class="inline-block bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-cyan-800/40 text-xs font-semibold px-2.5 py-1 rounded-full m-1">${t}</span>`).join('');
  const deliverablesList = s.deliverables.map(d => `<li class="flex items-start gap-2 mb-2 text-sm text-slate-700 dark:text-slate-300"><span class="text-blue-500 font-bold shrink-0">✓</span><span>${d}</span></li>`).join('');

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: `<span class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">${s.title}</span>`,
      html: `
        <div class="text-left mt-2 space-y-4">
          <p class="text-xs uppercase tracking-wider font-extrabold text-blue-600 dark:text-cyan-400">${s.tagline}</p>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${s.overview}</p>
          
          <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-2">Deliverables & Output:</h4>
            <ul class="list-none pl-0 mb-0">${deliverablesList}</ul>
          </div>

          <div>
            <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">Teknologi & Standar:</h4>
            <div class="flex flex-wrap -m-1">${techPills}</div>
          </div>

          <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span>Estimasi Durasi: <strong class="text-slate-800 dark:text-slate-200">${s.timeline}</strong></span>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Konsultasikan Solusi Ini",
      cancelButtonText: "Tutup",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      customClass: {
        popup: 'glass-ios dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 max-w-xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        openConsultationWithService(s.title);
      }
    });
  } else {
    alert(`${s.title}\n\n${s.overview}\n\nDeliverables:\n${s.deliverables.join('\n')}`);
  }
};

// --- 7. INTERACTIVE SOLUTION ESTIMATOR / PROJECT CALCULATOR ---
window.calculateSolution = () => {
  const serviceSelect = document.getElementById('calcService');
  const scaleSelect = document.getElementById('calcScale');
  const resultContainer = document.getElementById('calcResult');

  if (!serviceSelect || !scaleSelect) return;

  const sVal = serviceSelect.value;
  const scaleVal = scaleSelect.value;

  const dataMap = {
    iiot: { title: "Industrial IoT & Machine Telemetry", days: "14 – 25 Hari Kerja", focus: "Sensor Node, LoRa/Modbus Gateway, Server API Telemetri" },
    manufacturing: { title: "Smart Manufacturing & Digital OEE", days: "20 – 35 Hari Kerja", focus: "OEE Edge Collector, Digital Andon, Web Dashboard Supervisor" },
    otit: { title: "OT/IT Architecture & ISA-95", days: "15 – 30 Hari Kerja", focus: "Purdue Network Design, SCADA/ERP API Bridge, Security Audit" },
    security: { title: "Cybersecurity & Hardening IEC 62443", days: "7 – 18 Hari Kerja", focus: "VAPT, Network Segmentation, Hardening Linux & Server" },
    platform: { title: "Custom Web Platform & Dashboard", days: "15 – 30 Hari Kerja", focus: "Full-Stack Laravel/Node, RBAC, High-Performance Database" },
    monitoring: { title: "Predictive Maintenance & Grafana", days: "10 – 20 Hari Kerja", focus: "Vibration/Power Telemetry, Grafana Dashboards, Alerting Bot" }
  };

  const scaleMultiplier = {
    pilot: { text: "Proof of Concept / Pilot Project (1-2 Mesin)", mult: "Sangat Cepat & Terfokus" },
    medium: { text: "Medium Factory / Workstation Line (3-10 Mesin)", mult: "Menyeluruh dengan Integrasi Lini" },
    enterprise: { text: "Enterprise Multi-Line / Plant-wide Deployment", mult: "Skala Penuh & Redundansi Tinggi" }
  };

  const selectedService = dataMap[sVal] || dataMap.iiot;
  const selectedScale = scaleMultiplier[scaleVal] || scaleMultiplier.pilot;

  resultContainer.innerHTML = `
    <div class="bg-blue-50/80 dark:bg-slate-800/80 p-5 rounded-2xl border border-blue-200 dark:border-blue-900/50 mt-4 text-left transition-all">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs uppercase font-extrabold tracking-wider text-blue-600 dark:text-cyan-400">Rekomendasi Rencana Kerja</span>
        <span class="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">${selectedService.days}</span>
      </div>
      <h4 class="font-extrabold text-slate-900 dark:text-white text-base">${selectedService.title}</h4>
      <p class="text-xs text-slate-600 dark:text-slate-300 mt-1">Cakupan Skala: <strong>${selectedScale.text}</strong> (${selectedScale.mult})</p>
      <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-2 items-center justify-between">
        <span class="text-xs text-slate-500">Komponen Utama: <strong>${selectedService.focus}</strong></span>
        <div class="flex gap-2">
          <button onclick="openWhatsAppQuote('${selectedService.title}', '${selectedScale.text}')" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
            <span>Diskusi WhatsApp</span>
          </button>
          <button onclick="openEmailQuote('${selectedService.title}', '${selectedScale.text}')" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm">
            <span>Kirim Email RFP</span>
          </button>
        </div>
      </div>
    </div>
  `;
};

// --- 8. DIRECT CONTACT ACTIONS (WHATSAPP & GMAIL) ---
window.openWhatsAppQuote = (serviceName, scaleName) => {
  const text = encodeURIComponent(`Halo Maydef, menghadirkan,\n\nSaya tertarik untuk berdiskusi mengenai proyek:\n- Layanan: ${serviceName}\n- Skala: ${scaleName}\n\nMohon informasi ketersediaan jadwal konsultasi dan penawaran teknis. Terima kasih.`);
  window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
};

window.openEmailQuote = (serviceName, scaleName) => {
  const subject = encodeURIComponent(`Inquiry Proyek: ${serviceName} (${scaleName})`);
  const body = encodeURIComponent(`Halo Maydef,\n\nKami tertarik untuk mendiskusikan kebutuhan sistem kami:\n- Layanan: ${serviceName}\n- Cakupan Skala: ${scaleName}\n\nMohon waktu untuk berdiskusi lebih lanjut via Google Meet atau email balasan ini.\n\nSalam,\n[Nama / Perusahaan Anda]`);
  window.location.href = `mailto:andriansite@gmail.com?subject=${subject}&body=${body}`;
};

window.openConsultationWithService = (serviceName) => {
  const subject = encodeURIComponent(`Konsultasi Solusi: ${serviceName}`);
  const body = encodeURIComponent(`Halo Maydef,\n\nSaya tertarik berkonsultasi mengenai solusi "${serviceName}".\n\nDetail kebutuhan kami:\n[Tuliskan kebutuhan Anda di sini]\n\nKontak kami:\nNama:\nPerusahaan:\nNo. WhatsApp/HP:\n\nTerima kasih.`);
  window.location.href = `mailto:andriansite@gmail.com?subject=${subject}&body=${body}`;
};

// --- 9. PORTFOLIO FILTERING ---
window.filterProjects = (category, btnElement) => {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat.includes(category)) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 250);
    }
  });
};

// --- 10. MOBILE MENU TOGGLE ---
window.toggleMobileMenu = () => {
  const menu = document.getElementById('mobileMenu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
};
