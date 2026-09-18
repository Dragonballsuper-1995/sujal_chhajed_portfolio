import { Project, Skill, SocialLink } from './types';

export const PERSONAL_INFO = {
  name: "Sujal Chhajed",
  role: "AI/ML Engineer & Full-Stack Developer",
  bio: "I build end-to-end AI systems — from fine-tuned LLMs and real-time inference pipelines to full-stack products that run at production scale.",
  bio2: "Currently at VIT Chennai. Open to senior AI/ML & full-stack roles globally.",
  funFact: "I started with competitive programming and somehow ended up training neural networks. The journey makes sense in retrospect.",
  email: "sujalchhajed925@gmail.com",
  phone: "+91 9307346453",
  location: "Chennai, India",
  resumeLink: "https://drive.google.com/file/d/1IZu6KY1qTSuwFVJevxrT5JkJPtKgP54t/view?usp=sharing",
  github: "https://github.com/Dragonballsuper-1995",
  linkedin: "https://www.linkedin.com/in/sujalchhajed925/",
};

// -----------------------------------------------------------------------------
// SKILLS — icon + name + category dot only. svgSlug = simple-icons slug.
// -----------------------------------------------------------------------------
export const SKILLS: Skill[] = [
  // ML & GenAI  (category dot: cyan)
  { name: "PyTorch", svgSlug: "pytorch", category: "ml-genai" },
  { name: "Hugging Face", svgSlug: "huggingface", category: "ml-genai" },
  { name: "scikit-learn", svgSlug: "scikitlearn", category: "ml-genai" },
  { name: "OpenCV", svgSlug: "opencv", category: "ml-genai" },
  { name: "LLM Fine-Tuning", svgSlug: "ollama", category: "ml-genai" },
  { name: "RAG / Embeddings", svgSlug: "langchain", category: "ml-genai" },

  // Full-Stack  (category dot: green)
  { name: "React", svgSlug: "react", category: "fullstack" },
  { name: "Next.js", svgSlug: "nextdotjs", category: "fullstack" },
  { name: "TypeScript", svgSlug: "typescript", category: "fullstack" },
  { name: "Tailwind CSS", svgSlug: "tailwindcss", category: "fullstack" },
  { name: "FastAPI", svgSlug: "fastapi", category: "fullstack" },
  { name: "Node.js", svgSlug: "nodedotjs", category: "fullstack" },
  { name: "Kotlin", svgSlug: "kotlin", category: "fullstack" },
  { name: "Python", svgSlug: "python", category: "fullstack" },

  // Data Engineering  (category dot: yellow)
  { name: "Pandas", svgSlug: "pandas", category: "data-eng" },
  { name: "PostgreSQL", svgSlug: "postgresql", category: "data-eng" },
  { name: "Supabase", svgSlug: "supabase", category: "data-eng" },
  { name: "XGBoost", svgSlug: "python", category: "data-eng" },
  { name: "NumPy", svgSlug: "numpy", category: "data-eng" },

  // MLOps & Cloud  (category dot: purple)
  { name: "Docker", svgSlug: "docker", category: "mlops" },
  { name: "GitHub Actions", svgSlug: "githubactions", category: "mlops" },
  { name: "Cloudflare", svgSlug: "cloudflare", category: "mlops" },
  { name: "Git", svgSlug: "git", category: "mlops" },
];

// -----------------------------------------------------------------------------
// PROJECTS — 3 featured (flagship row) + 5 archive (smaller row)
// Each has exactly one accentColor, one primaryMetric, max 3 tags.
// -----------------------------------------------------------------------------
export const PROJECTS: Project[] = [
  // ── FLAGSHIP TIER (featured: true) ──────────────────────────────────────────
  {
    id: 1,
    title: "Phonos.ai",
    tagline: "Hardware Intelligence Smartphone Recommender",
    description: "A production 2-stage DLRM combining semantic intent vectors, hardware specification embeddings, and XGBoost ranking with 100% verified constraint grounding.",
    tags: ["Next.js", "FastAPI", "XGBoost"],
    link: "https://phonosai.vercel.app/",
    github: "https://github.com/Dragonballsuper-1995/Phonos.ai",
    huggingFace: "https://huggingface.co/spaces/SujalChhajed925/phonos-api",
    category: "AI/ML",
    image: "/phonos-ai.svg",
    accentColor: "#5CE1E6",
    primaryMetric: "100% Constraint Validity",
    featured: true,
    caseStudy: {
      problem: "Indian smartphone buyers are bombarded by deceptive marketing jargon with no objective hardware scoring — no way to verify claims against real manufacturing data.",
      solution: "Physics-based hardware scoring engine mapping silicon process nodes, memory bandwidth, and aperture sizes, coupled with YouTube Aspect Sentiment gating and an XGBoost DLRM ranker.",
      directorsCutSummary: "Built to counter sponsored benchmark bias in the Indian mobile market by grounding every spec against raw nanometer architecture, memory bus bandwidth, and thermal dissipation metrics.",
      architecture: [
        { step: "Stage 1", title: "Defect Shielding & Ingestion", detail: "Purges documented hardware failures and filters strictly current Indian retail catalogues." },
        { step: "Stage 2", title: "5D Vector Embedding Projection", detail: "Projects hardware specs into L2-normalized vector space and computes cosine distance to user intent." },
        { step: "Stage 3", title: "Gated ABSA Sentiment Modulation", detail: "Applies negative sentiment penalties from YouTube teardowns to hardware subscores." },
        { step: "Stage 4", title: "XGBoost DLRM Ranking", detail: "Final gradient-boosted trees score candidates, outputting probability-calibrated recommendations." }
      ],
      metrics: [
        { label: "Constraint Validity", value: "100.0% CVR" },
        { label: "Confidence Score", value: "0.9745 (Grade A+)" },
        { label: "Calibration Error", value: "0.0255 ECE" },
        { label: "Test Coverage", value: "45/45 Pytest" }
      ],
      tradeoffs: [
        {
          decision: "XGBoost DLRM over Deep Dual-Tower Neural Network",
          rationale: "Catalog size (~1,200 active SKUs) makes heavy neural networks prone to overfitting and adds 180ms inference latency. Gradient boosted trees train in 4.2s, evaluate in <4ms, and provide native SHAP interpretability.",
          alternative: "Two-tower PyTorch neural collaborative filtering (high latency, cold-start failure on new releases)"
        },
        {
          decision: "Physics-Based Spec Derivation over Pure Benchmarks (AnTuTu / Geekbench)",
          rationale: "Synthetic benchmarks are frequently gamed by OEM thermal throttling overrides during benchmark detection. Raw transistor density (nm) + memory bus width (GB/s) cannot be faked in software.",
          alternative: "Scraping benchmark aggregator scores directly"
        }
      ],
      debuggingWarStory: {
        title: "The Phantom Cosine Collapse on Multi-Variant SKUs",
        bug: "Flagship phones with multiple RAM/storage variants (e.g. 8GB vs 12GB) were receiving inverted recommendation ranks where lower-tier variants scored higher than their top-tier twins.",
        rootCause: "Vector normalization was performing L2 projection before zero-filling unlisted secondary telephoto sensor specs, causing missing camera dims to pull the Euclidean norm inward and artificially inflate cosine similarity.",
        fix: "Implemented deterministic domain-aware imputations and isolated RAM/Storage tiers into a secondary continuous delta feature layer before passing vectors to cosine projection.",
        lessonLearned: "Never normalize vectors with heterogeneous zero-padded optional dimensions without establishing an explicit feature projection schema."
      }
    }
  },
  {
    id: 2,
    title: "MetaGen",
    tagline: "Fine-Tuned GGUF YouTube Metadata Studio",
    description: "Full-stack AI studio transforming video scripts into high-CTR titles and tags using 4 custom fine-tuned open-source LLMs with ~800 t/s streaming and 5-tier cloud failover.",
    tags: ["Next.js", "FastAPI", "llama.cpp"],
    link: "https://metagen-one.vercel.app",
    github: "https://github.com/Dragonballsuper-1995/MetaGen",
    huggingFace: "https://huggingface.co/spaces/SujalChhajed925/MetaGen",
    category: "AI/ML",
    image: "/metagen.svg",
    accentColor: "#FFDE59",
    primaryMetric: "~800 tokens/sec on Groq LPU",
    featured: true,
    caseStudy: {
      problem: "Creators spend hours guessing SEO metadata or relying on ChatGPT prompts that produce robotic titles failing YouTube's indexing algorithms.",
      solution: "Fine-tuned 4 open-source LLMs on high-CTR YouTube metadata, quantized to Q4_K_M GGUF, with real-time SSE token streaming and a 5-tier cloud failover cascade.",
      directorsCutSummary: "Engineered around the reality that cloud AI providers face rate-limits, cold starts, and outages. Features zero downtime via an automated 5-tier inference cascade down to local quantized GGUF containers.",
      architecture: [
        { step: "Client", title: "Single-Viewport Studio", detail: "Next.js 16 UI with real-time SSE token stream parser and authentic YouTube feed mockups." },
        { step: "API Gateway", title: "FastAPI Async Proxy", detail: "Validates inputs, manages token budgets, and orchestrates multi-tier failover cascade." },
        { step: "Primary Inference", title: "Groq LPU Acceleration", detail: "Delivers sub-second real-time token streaming at ~800 tokens per second." },
        { step: "Fallback Engine", title: "Local GGUF llama.cpp", detail: "Ensures 100% availability through local offline GGUF quantization containers on Docker." }
      ],
      metrics: [
        { label: "Token Speed", value: "~800 t/s via Groq LPU" },
        { label: "Models", value: "4 Fine-Tuned Checkpoints" },
        { label: "Quantization", value: "Q4_K_M GGUF" },
        { label: "Live Demo", value: "Hugging Face Spaces" }
      ],
      tradeoffs: [
        {
          decision: "5-Tier Cloud & Local Failover Cascade over Single Reliable Provider",
          rationale: "Even tier-1 inference endpoints (Groq, Together, Cerebras) experience burst-traffic 429 rate limits or transient outages. A sequential fallback cascade ensures 100% user request completion without showing an error state.",
          alternative: "Exponential backoff retries on a single API endpoint (frustrates users with 10s+ loading spinners)"
        },
        {
          decision: "Custom Q4_K_M GGUF Quantization over 16-bit Float Hugging Face Inference",
          rationale: "Quantizing down to 4-bit medium tensor blocks preserved 97.8% of perplexity benchmark scores while fitting the model fleet into low-cost 8GB VRAM runtime instances.",
          alternative: "Hosting raw unquantized FP16 models on expensive dedicated cloud GPU clusters"
        }
      ],
      debuggingWarStory: {
        title: "The SSE Chunk Truncation Mid-Token Heist",
        bug: "During ultra-fast ~800 t/s streaming on Groq, the Next.js frontend would periodically drop multi-byte Unicode characters (like emojis or quotes), rendering ugly replacement glyphs ().",
        rootCause: "The TCP chunk boundaries fragmented multi-byte UTF-8 code points across consecutive SSE `data:` packets, and the decoder was parsing each string slice independently rather than using a streaming TextDecoder.",
        fix: "Replaced per-chunk string decoders with a stateful `TextDecoder({ stream: true })` pipeline that buffers trailing partial byte fragments across chunk boundaries.",
        lessonLearned: "Fast streaming tokens expose stream decoding assumptions that slow APIs never reveal."
      }
    }
  },
  {
    id: 3,
    title: "Loopa",
    tagline: "Cross-Platform Cinematic Tracker & AI Engine",
    description: "Cross-platform cinema & anime tracker with bi-directional Supabase Realtime sync, Offline-First LWW protocol, and Gemini 2.5 semantic search — native Android + installable PWA.",
    tags: ["Kotlin", "Supabase", "Gemini 2.5"],
    link: "https://loopa1.netlify.app/",
    github: "https://github.com/Dragonballsuper-1995/loopa",
    category: "Fullstack",
    image: "/loopa.svg",
    accentColor: "#7ED957",
    primaryMetric: "100% Offline Availability — LWW Sync",
    featured: true,
    caseStudy: {
      problem: "Watchlist tools are fragmented across devices, lack offline reliability, and their keyword search can't understand cinematic vibes.",
      solution: "Dual-client system (Kotlin Jetpack Compose + Vanilla JS PWA) backed by Supabase Realtime with an Offline-First Last-Write-Wins sync protocol and Gemini 2.5 semantic discovery.",
      directorsCutSummary: "Bridging native Android (Kotlin) and modern web (PWA) with zero data loss in zero-connectivity environments through an event-sourced local mutation queue.",
      architecture: [
        { step: "Client Layer", title: "Dual Platform Frontend", detail: "Kotlin Jetpack Compose Android app + responsive PWA with Service Worker cache." },
        { step: "Sync Protocol", title: "Offline-First LWW", detail: "Persists writes locally first, queues pending operations, and flushes on reconnect." },
        { step: "Cloud Backend", title: "Supabase & PostgreSQL", detail: "Row-Level Security, realtime WebSocket subscriptions, and TMDB/Jikan metadata hydration." },
        { step: "Edge Security", title: "Cloudflare Worker Proxy", detail: "Guards Gemini API keys, caches frequent queries for 24h, handles edge rate limiting." }
      ],
      metrics: [
        { label: "Offline Availability", value: "100% (SQLite & IndexedDB)" },
        { label: "Sync Protocol", value: "Bi-directional Last-Write-Wins" },
        { label: "Edge Caching", value: "24-Hour TTL on Cloudflare" },
        { label: "Platform", value: "PWA + Android APK" }
      ],
      tradeoffs: [
        {
          decision: "Offline-First Last-Write-Wins (LWW) with Mutation Queue over CRDTs",
          rationale: "Full CRDT state vectors introduce significant payload bloat and complex serialization in Kotlin/SQLite and JavaScript/IndexedDB. For single-user media list tracking, deterministic wall-clock LWW with an atomic local queue gave identical consistency at 90% less code complexity.",
          alternative: "Yjs / Automerge state-based CRDTs (heavy dependencies, difficult Kotlin native interop)"
        },
        {
          decision: "Cloudflare Edge Worker Proxy for Gemini AI vs Client-Side Direct SDK",
          rationale: "Direct client API keys get ripped immediately in public PWAs or APK decompilations. The edge worker encapsulates key rotation, enforces IP rate limits, and caches identical semantic queries for 24 hours at 0ms origin latency.",
          alternative: "Embedding restricted API keys inside client builds"
        }
      ],
      debuggingWarStory: {
        title: "The Clock-Skew Phantom Resurrection Loop",
        bug: "Deleting an anime title on an Android device while traveling across time zones caused the deleted entry to resurrect itself immediately once the phone reconnected to WiFi.",
        rootCause: "Local client timestamps used device time (`System.currentTimeMillis()`) for mutation records. The phone's clock was 4 minutes behind the Supabase server, making the server's earlier update look newer than the client's deletion under LWW comparison.",
        fix: "Transitioned all sync causality checks from raw local wall-clock time to monotonic logical sequence counters paired with server-calibrated NTP delta offsets on connection handshake.",
        lessonLearned: "Never trust client wall-clock time for distributed distributed conflict resolution without logical sequence numbers."
      }
    }
  },

  // ── ARCHIVE TIER (featured: false) ──────────────────────────────────────────
  {
    id: 4,
    title: "Privacy-Preserving Proctoring",
    tagline: "Non-Invasive Exam Security via Keystroke Dynamics",
    description: "Detects cheating through keyboard & mouse interaction analysis using Isolation Forest & Sentence-Transformers. Zero webcam. Zero microphone.",
    tags: ["FastAPI", "scikit-learn", "Next.js"],
    github: "https://github.com/Dragonballsuper-1995/Privacy-Preserving-Cheating-Detection-In-Online-Exams-Using-Behavioral-Biometrics",
    category: "AI/ML",
    image: "/privacy-proctoring.svg",
    accentColor: "#8C52FF",
    primaryMetric: "0% Webcam / Mic Surveillance",
    featured: false,
    caseStudy: {
      problem: "Traditional online exam proctoring relies on intrusive webcam and microphone surveillance, invading student privacy while remaining vulnerable to sophisticated bypasses.",
      solution: "Passive, non-invasive behavioural biometrics engine that profiles continuous keystroke timing dynamics and cursor trajectory anomalies using unsupervised Isolation Forests and semantic embeddings.",
      architecture: [
        { step: "Telemetry Ingestion", title: "Client Keystroke & Mouse Stream", detail: "Captures key hold times, flight times, and pointer velocity vectors without logging raw key characters." },
        { step: "Feature Extraction", title: "Flight-Time & Digraph Vectors", detail: "Extracts n-graph latency distributions and computes rolling statistical entropy over sliding exam windows." },
        { step: "Anomaly Isolation", title: "Isolation Forest Outlier Scoring", detail: "Detects anomalous typing rhythms and secondary-user takeovers in near real-time." },
        { step: "Verification API", title: "FastAPI Risk Audit Gateway", detail: "Emits tamper-proof cryptographic trust scores and flagged anomaly segments to proctor dashboards." }
      ],
      metrics: [
        { label: "Surveillance", value: "0% Cam/Mic" },
        { label: "Latency", value: "<150ms Scoring" },
        { label: "Model Type", value: "Isolation Forest" },
        { label: "Privacy Rating", value: "Zero PII Stored" }
      ]
    }
  },
  {
    id: 5,
    title: "AlphaGaze",
    tagline: "Explainable Financial NLP & Stock Forecasting",
    description: "Interpretable stock prediction dashboard combining FinBERT attention heatmaps with time-series trend models (Prophet/ARIMA) and changepoint attribution.",
    tags: ["FastAPI", "FinBERT", "Prophet"],
    github: "https://github.com/Dragonballsuper-1995/AlphaGaze",
    category: "Data Science",
    image: "/alphagaze.svg",
    accentColor: "#FF914D",
    primaryMetric: "Token-Level Attention Heatmaps",
    featured: false,
    caseStudy: {
      problem: "Black-box financial ML predictors output price trajectories without explainability, leaving quantitative analysts unable to audit how news headlines dictate forecast shifts.",
      solution: "Explainable NLP forecasting system fusing FinBERT self-attention weights with Bayesian additive time-series models (Prophet/ARIMA) to visually attribute market volatility to specific tokens in earnings reports.",
      architecture: [
        { step: "Feed Ingestion", title: "SEC Filings & Market Wire Scraper", detail: "Aggregates real-time financial headlines, 10-K filings, and ticker price feeds." },
        { step: "NLP Attention", title: "FinBERT Attention Extraction", detail: "Extracts multi-head attention weights to score word-level bullish/bearish influence." },
        { step: "Time-Series Fusion", title: "Bayesian Changepoint Decomposition", detail: "Aligns sentiment spikes with price innovations using additive trend and seasonality decomposition." },
        { step: "Interactive Studio", title: "FastAPI & Interactive Heatmap UI", detail: "Renders token-level saliency heatmaps overlaid on interactive candlestick price charts." }
      ],
      metrics: [
        { label: "Attention Depth", value: "12-Layer Heatmaps" },
        { label: "Base Model", value: "FinBERT NLP" },
        { label: "Time Series", value: "Prophet / ARIMA" },
        { label: "Explainability", value: "Token Saliency" }
      ]
    }
  },
  {
    id: 6,
    title: "FPL Analytics Hub",
    tagline: "Automated Daily MLOps Pipeline & XGBoost Predictor",
    description: "Serverless analytics platform using GitHub Actions to ingest live Premier League data daily, retrain 5 XGBoost models, and publish predictions automatically.",
    tags: ["Python", "XGBoost", "GitHub Actions"],
    link: "https://dragonballsuper-1995.github.io/Fantasy_Premier_League_Analytics_Hub/",
    github: "https://github.com/Dragonballsuper-1995/Fantasy_Premier_League_Analytics_Hub",
    category: "Data Science",
    image: "/fpl-analytics-hub.webp",
    accentColor: "#FF66C4",
    primaryMetric: "$0 Infrastructure · 100% Automated",
    featured: false,
    caseStudy: {
      problem: "Fantasy Premier League managers face stale, subjective advice and manual weekly data wrangling across disparate match statistics and fixture difficulty ratings.",
      solution: "Fully automated zero-cost MLOps pipeline executing daily via GitHub Actions to harvest official Premier League APIs, engineer form and fixture metrics, retrain 5 position-specific XGBoost regressors, and deploy static reports to GitHub Pages.",
      architecture: [
        { step: "Daily Ingestion", title: "Automated API Extraction", detail: "Cron-triggered GitHub Actions fetch raw player statistics, injuries, and fixture difficulty matrices." },
        { step: "Feature Engineering", title: "Rolling Decay & xG Aggregation", detail: "Computes exponential moving averages for expected goals (xG), expected assists (xA), and minutes reliability." },
        { step: "Ensemble Training", title: "5 Position-Specific XGBoost Models", detail: "Trains separate gradient-boosted trees for GKs, DEFs, MIDs, and FWDs calibrated on historical gameweeks." },
        { step: "Serverless Deploy", title: "Automated Static Web Publication", detail: "Generates interactive prediction tables and publishes static dashboard to GitHub Pages at \$0 infra cost." }
      ],
      metrics: [
        { label: "Infrastructure", value: "$0 / Month" },
        { label: "Automation", value: "100% Daily Cron" },
        { label: "Model Fleet", value: "5 XGBoost Trees" },
        { label: "Hosting", value: "GitHub Pages" }
      ]
    }
  },
  {
    id: 7,
    title: "AnomLogBERT",
    tagline: "Transformer-Powered System Log Anomaly Detection",
    description: "Deep learning framework using dense sentence embeddings (MiniLM-L12) and unsupervised DBSCAN clustering to isolate critical failure patterns in high-velocity system logs.",
    tags: ["PyTorch", "Transformers", "Hugging Face"],
    link: "https://huggingface.co/spaces/ayush-shukla135/AnomLogBert",
    github: "https://github.com/Dragonballsuper-1995/AnomLogBert",
    huggingFace: "https://huggingface.co/spaces/ayush-shukla135/AnomLogBert",
    category: "AI/ML",
    image: "/anomlogbert.webp",
    accentColor: "#E10600",
    primaryMetric: "384-dim Semantic Embedding Space",
    featured: false,
    caseStudy: {
      problem: "Modern distributed infrastructure generates millions of log lines per minute. Rule-based regexes fail to catch novel failure modes and bury DevOps teams in alert fatigue.",
      solution: "Semantic anomaly detection pipeline using MiniLM-L12 dense embeddings to represent raw unstructured log templates in a continuous 384-dimensional vector space, clustered via unsupervised DBSCAN to isolate novel crash signatures.",
      architecture: [
        { step: "Log Preprocessing", title: "Regex Normalization & Masking", detail: "Masks dynamic variables (IP addresses, timestamps, session IDs) while retaining critical semantic structure." },
        { step: "Dense Embedding", title: "MiniLM-L12 Transformer Encoding", detail: "Projects processed log lines into 384-dimensional dense semantic vectors using PyTorch." },
        { step: "Density Clustering", title: "Unsupervised DBSCAN Spatial Clustered", detail: "Groups routine operational messages and flags low-density outliers as potential system failures." },
        { step: "Exploration UI", title: "Hugging Face Interactive Space", detail: "Provides real-time interactive log file upload, clustering inspection, and anomaly severity triage." }
      ],
      metrics: [
        { label: "Embedding Space", value: "384 Dimensions" },
        { label: "Encoder", value: "MiniLM-L12" },
        { label: "Clustering", value: "DBSCAN" },
        { label: "Deployment", value: "Hugging Face" }
      ]
    }
  },
  {
    id: 8,
    title: "Urban Escapade",
    tagline: "Interactive Cultural Portal — India's 28+ States",
    description: "Magazine-style visual portal showcasing geography, culture, and culinary traditions across India through responsive CSS Grid — zero framework overhead.",
    tags: ["HTML5", "CSS Grid", "JavaScript"],
    link: "https://siddharth-y26.github.io/Urban-Escapade/",
    github: "https://github.com/Dragonballsuper-1995/Urban-Escapade",
    category: "Web Dev",
    image: "/urban-escapade.webp",
    accentColor: "#FFDE59",
    primaryMetric: "Sub-Second FCP · Zero Dependencies",
    featured: false,
    caseStudy: {
      problem: "State travel guides and cultural encyclopedias are often cluttered, heavy with bloated client scripts, and fail to offer an engaging visual journey across India's rich diversity.",
      solution: "Lightweight, editorial magazine-style cultural portal engineered with semantic HTML5, vanilla JavaScript, and modern CSS Grid — delivering responsive exploration across all 28 Indian states with zero framework overhead and instant First Contentful Paint.",
      architecture: [
        { step: "State Indexing", title: "Curated Cultural Datastore", detail: "Compiles verified regional geography, heritage landmarks, cuisines, and festivals into optimized static JSON." },
        { step: "Editorial Layout", title: "Responsive CSS Grid Composition", detail: "Crafts asymmetrical, magazine-inspired grid layouts that adapt fluidly across all screen viewports." },
        { step: "Lightweight UI", title: "Vanilla JavaScript Interaction", detail: "Handles dynamic state filtering and interactive modal galleries with zero external framework dependencies." },
        { step: "Performance", title: "Static Edge Distribution", detail: "Optimized web assets and zero client runtime bundle overhead ensure sub-second FCP on mobile networks." }
      ],
      metrics: [
        { label: "Page Weight", value: "<150 KB Core" },
        { label: "Dependencies", value: "0 Frameworks" },
        { label: "Coverage", value: "28+ Indian States" },
        { label: "FCP Speed", value: "Sub-Second" }
      ]
    }
  }
];

export const FEATURED_PROJECTS = PROJECTS.filter(p => p.featured);
export const ARCHIVE_PROJECTS = PROJECTS.filter(p => !p.featured);

export const SOCIALS: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/Dragonballsuper-1995/", iconName: "Github" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/sujalchhajed925/", iconName: "Linkedin" },
  { platform: "Instagram", url: "https://www.instagram.com/sujalchhajed925/", iconName: "Instagram" },
  { platform: "X", url: "https://x.com/sujal_chhajed", iconName: "X" },
];

export const SKILL_CATEGORY_META = {
  'ml-genai': { label: 'ML & GenAI', color: '#5CE1E6' },
  'fullstack': { label: 'Full-Stack', color: '#7ED957' },
  'data-eng': { label: 'Data Eng', color: '#FFDE59' },
  'mlops': { label: 'MLOps', color: '#8C52FF' },
};
