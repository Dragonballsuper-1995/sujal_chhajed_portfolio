
import { Project, Skill, SocialLink } from './types';

export const PERSONAL_INFO = {
  name: "Sujal Sanjay Chhajed",
  role: "AI Developer & ML Engineer",
  tagline: "Crafting intelligent solutions — from NLP-powered systems to interactive web experiences.",
  bio: "I’m Sujal Sanjay Chhajed! A Computer Science & Engineering student at VIT Chennai with a sprinkle of AI & ML. I describe myself as a sports junkie, movie lover, and proud foodie who loves mixing creativity with code. Whether it’s the roar of an F1 engine or the strategy of a cricket match, I bring that same passion to building tech that matters.",
  email: "sujalchhajed925@gmail.com",
  phone: "+91 9307346453",
  location: "Chennai, India",
  resumeLink: "https://drive.google.com/file/d/1WKBRplQ_N3ZZNsujk_mZEQqAmOTbbYue/view?usp=sharing"
};

export const SKILLS: Skill[] = [
  { name: "Python", icon: "Snake", level: 95 },
  { name: "Machine Learning", icon: "Brain", level: 90 },
  { name: "NLP", icon: "MessageSquare", level: 85 },
  { name: "Data Analysis", icon: "BarChart", level: 85 },
  { name: "Web Development", icon: "Globe", level: 80 },
  { name: "TensorFlow/PyTorch", icon: "Cpu", level: 85 },
  { name: "SQL", icon: "Database", level: 80 },
  { name: "AI Deployment", icon: "Rocket", level: 75 },
  { name: "React", icon: "Code", level: 80 },
  { name: "TypeScript", icon: "FileCode", level: 75 },
  { name: "Docker", icon: "Container", level: 70 },
  { name: "Git", icon: "GitBranch", level: 85 },
  { name: "Pandas", icon: "Table", level: 90 },
  { name: "NumPy", icon: "Calculator", level: 90 },
  { name: "Scikit-learn", icon: "Binary", level: 85 },
  { name: "OpenCV", icon: "Camera", level: 75 },
];

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Fantasy Premier League Analytics Hub",
    description: "A fully automated analytics hub that uses Python (Pandas, XGBoost) and GitHub Actions to fetch live FPL data, retrain 5 ML models, and deploy daily player point predictions to a responsive dashboard.",
    tags: ["Python", "Machine Learning", "GitHub Actions", "Pandas", "JavaScript", "Tailwind CSS", "Chart.js"],
    link: "https://dragonballsuper-1995.github.io/Fantasy_Premier_League_Analytics_Hub/",
    github: "https://github.com/Dragonballsuper-1995/Fantasy_Premier_League_Analytics_Hub",
    category: "Data Science",
    image: "/fpl-analytics-hub.webp",
    caseStudy: {
      problem: "Fantasy Premier League managers struggle to process vast amounts of player data to make weekly transfer decisions. Manual analysis is time-consuming and prone to bias.",
      solution: "I built an automated pipeline that scrapes data daily, feeds it into XGBoost models trained on historical performance, and visualizes predicted points for the upcoming gameweek.",
      features: [
        "Automated Daily Data Scraping via GitHub Actions",
        "XGBoost Regression Models for Point Prediction",
        "Interactive Dashboard with Filtering",
        "Player Form vs. Fixture Difficulty Analysis"
      ],
      challenges: [
        "Handling missing data for new players transferred into the league.",
        "Automating the retraining pipeline within GitHub Actions memory limits.",
        "Visualizing complex multi-dimensional data clearly on mobile devices."
      ],
      stackDetails: [
        { name: "Python/Pandas", reason: "For robust data cleaning and feature engineering." },
        { name: "XGBoost", reason: "Chosen for its high performance on structured tabular data." },
        { name: "GitHub Actions", reason: "Zero-cost CI/CD for daily automation." }
      ]
    }
  },
  {
    id: 2,
    title: "Urban Escapade",
    description: "Interactive website showcasing India's diverse states with cultural, regional, and geographical information.",
    tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    link: "https://siddharth-y26.github.io/Urban-Escapade/",
    github: "https://github.com/Siddharth-Y26/Urban-Escapade",
    category: "Web Dev",
    image: "/urban-escapade.webp",
    caseStudy: {
      problem: "Travel information about India's diverse states is often scattered or presented in text-heavy formats that fail to capture the cultural vibrancy.",
      solution: "Urban Escapade serves as a visual-first portal. Users can interactively explore states, instantly accessing curated info on culture, food, and geography.",
      features: [
        "Interactive Map/Grid Interface",
        "Dynamic Content Loading",
        "Rich Media Galleries for each State",
        "Mobile-First Responsive Layout"
      ],
      challenges: [
        "Optimizing high-resolution asset loading to ensure fast FCP.",
        "Designing a navigation system that scales across 28+ states without clutter.",
        "Ensuring cross-browser compatibility for complex CSS grid layouts."
      ],
      stackDetails: [
        { name: "Vanilla JS", reason: "To maintain a lightweight footprint without framework overhead." },
        { name: "CSS Grid", reason: "For creating the complex, magazine-style layout." }
      ]
    }
  },
  {
    id: 3,
    title: "YouTube Title & Description Generator",
    description: "AI-powered tool to automatically generate SEO-friendly YouTube titles, descriptions, hashtags, and tags from any video script or summary.",
    tags: ["T5 Model", "BART", "RAKE Algorithm", "Gradio UI"],
    link: "https://huggingface.co/spaces/SujalChhajed925/yt-title-desc-generator",
    github: "https://github.com/Dragonballsuper-1995/yt-title-desc-generator",
    category: "AI/ML",
    image: "/yt-title-desc-generator.webp",
    caseStudy: {
      problem: "Content creators spend disproportionate time crafting SEO metadata instead of creating content, often missing keywords that drive discovery.",
      solution: "A web-based tool leveraging fine-tuned Transformer models (T5 & BART) to generate high-CTR titles and descriptions from a simple video script dump.",
      features: [
        "One-click SEO Generation",
        "Keyword Extraction via RAKE",
        "Sentiment Analysis for Title Optimization",
        "Easy-to-use Gradio Interface"
      ],
      challenges: [
        "Fine-tuning T5 on specific YouTube metadata datasets to prevent generic outputs.",
        "Reducing inference time for a smooth user experience on Hugging Face Spaces.",
        "Balancing 'clickbait' style with accurate summarization."
      ],
      stackDetails: [
        { name: "Hugging Face Transformers", reason: "Access to state-of-the-art NLP models." },
        { name: "Gradio", reason: "Rapid prototyping of ML interfaces." },
        { name: "PyTorch", reason: "Backend tensor computation for the models." }
      ]
    }
  },
  {
    id: 4,
    title: "AnomLogBERT",
    description: "Deep learning framework for automated anomaly detection in system log files using transformer-based models.",
    tags: ["all-MiniLM-L12-v2", "Transformers", "Log Analysis", "Anomaly Detection"],
    link: "https://huggingface.co/spaces/ayush-shukla135/AnomLogBert",
    github: "https://github.com/Ayushs135/AnomLogBert",
    category: "AI/ML",
    image: "/anomlogbert.webp",
    caseStudy: {
      problem: "Modern distributed systems generate massive logs. Manually finding error patterns (anomalies) in millions of lines is impossible for humans.",
      solution: "AnomLogBERT utilizes BERT-based embeddings to understand the semantic meaning of log lines, clustering them to identify outliers that represent system failures.",
      features: [
        "Semantic Log Parsing",
        "Unsupervised Anomaly Detection",
        "Real-time Log Stream Processing",
        "Visual Cluster Analysis"
      ],
      challenges: [
        "Tokenizing variable log parts (timestamps, IPs) without losing context.",
        "Training the model to distinguish between rare (but normal) events and actual errors.",
        "Handling the computational load of BERT for high-volume streams."
      ],
      stackDetails: [
        { name: "BERT (MiniLM)", reason: "Efficient transformer architecture for sentence embeddings." },
        { name: "Scikit-learn", reason: "For clustering algorithms (Isolation Forest/DBSCAN)." }
      ]
    }
  }
];

export const SOCIALS: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/Dragonballsuper-1995/", iconName: "Github" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/sujalchhajed925/", iconName: "Linkedin" },
  { platform: "Instagram", url: "https://www.instagram.com/sujalchhajed925/", iconName: "Instagram" },
  { platform: "Twitter", url: "https://x.com/sujal_chhajed", iconName: "Twitter" },
];

export const CHARACTER_TRAITS = [
  {
    id: 'f1',
    title: 'F1 Fanatic',
    subtitle: 'Forza Ferrari!!',
    description: 'Scuderia Ferrari supporter through pain and glory. Next year is our year! 🏎️🇮🇹',
    bgClass: 'bg-neo-red',
    textColor: 'text-black',
    iconType: 'custom-f1',
    rotateText: 'BOX BOX',
    rotateTextSize: 'text-6xl md:text-7xl'
  },
  {
    id: 'anime',
    title: 'Anime',
    subtitle: 'Dragon Ball Super',
    description: 'Goku is the GOAT. Currently re-watching DBZ Cell Saga. Power level > 9000. 💥',
    bgClass: 'bg-neo-orange',
    textColor: 'text-black',
    iconType: 'custom-anime',
    rotateText: '悟空',
    rotateTextSize: 'text-6xl md:text-7xl'
  },
  {
    id: 'foodie',
    title: 'Foodie',
    subtitle: 'Street to Gourmet',
    description: 'Spicy Misal Pav & Butter Chicken connoisseur. Coffee is my fuel. ☕🍛',
    bgClass: 'bg-neo-yellow',
    textColor: 'text-black',
    iconType: 'lucide-coffee',
    rotateText: 'TASTY',
    rotateTextSize: 'text-6xl md:text-7xl'
  },
  {
    id: 'cinema',
    title: 'Cinema',
    subtitle: 'Story Seeker',
    description: 'Sci-Fi & Thrillers. Interstellar changed my life. Nolan fanboy. 🎬🍿',
    bgClass: 'bg-neo-blue',
    textColor: 'text-black',
    iconType: 'lucide-film',
    rotateText: 'ACTION',
    rotateTextSize: 'text-6xl md:text-7xl'
  }
];
