
import React from 'react';
import { Project } from '../types';
import { ExternalLink, Github, Layers, Target, AlertTriangle, Code2 } from 'lucide-react';
import Badge from './ui/Badge';

interface ProjectCaseStudyProps {
  project: Project;
}

const ProjectCaseStudy: React.FC<ProjectCaseStudyProps> = ({ project }) => {
  if (!project.caseStudy) return null;

  const { problem, solution, features, challenges, stackDetails } = project.caseStudy;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white dark:bg-neo-dark-surface font-sans">
      
      {/* Hero Image Section */}
      <div className="relative w-full aspect-video md:aspect-[21/9] border-b-4 border-black dark:border-neo-dark-border shrink-0 overflow-hidden group">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
      </div>

      {/* Content Container */}
      <div className="p-6 md:p-8">
        
        {/* Header Information */}
        <div className="mb-8 border-b-4 border-black dark:border-neo-dark-border pb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="accent">{project.category}</Badge>
            {project.tags.slice(0, 3).map(tag => (
               <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight mb-4 text-black dark:text-white">
            {project.title}
          </h2>
          <p className="font-mono text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
             {project.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
             <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-1 bg-neo-yellow text-black border-2 border-black font-bold uppercase py-3 text-center hover:shadow-neo transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
             >
                Live Demo <ExternalLink size={16} />
             </a>
             {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white font-bold uppercase py-3 text-center hover:shadow-neo transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
                >
                  Code <Github size={16} />
                </a>
             )}
          </div>
        </div>

        {/* Detailed Case Study Grid */}
        <div className="space-y-12">
           
           {/* Problem & Solution */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-red-50 dark:bg-red-900/10 p-6 border-l-4 border-neo-pink shadow-sm">
                 <h3 className="font-black uppercase flex items-center gap-2 mb-3 text-xl tracking-wide">
                    <AlertTriangle size={24} className="text-neo-pink" /> The Challenge
                 </h3>
                 <p className="font-mono text-sm md:text-base leading-relaxed opacity-90">{problem}</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/10 p-6 border-l-4 border-neo-green shadow-sm">
                 <h3 className="font-black uppercase flex items-center gap-2 mb-3 text-xl tracking-wide">
                    <Target size={24} className="text-neo-green" /> The Solution
                 </h3>
                 <p className="font-mono text-sm md:text-base leading-relaxed opacity-90">{solution}</p>
              </div>
           </div>

           {/* Features */}
           <div>
              <h3 className="font-black uppercase text-2xl mb-6 flex items-center gap-3 border-b-4 border-black dark:border-white/20 pb-3 inline-block">
                 <Layers size={28} /> Key Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-900 border-2 border-transparent hover:border-black dark:hover:border-white transition-colors">
                       <span className="bg-neo-purple text-white w-8 h-8 flex items-center justify-center font-black text-sm shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_#fff]">{i + 1}</span>
                       <span className="pt-1 font-mono text-sm leading-snug">{feature}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Technical Stack Deep Dive */}
           <div>
              <h3 className="font-black uppercase text-2xl mb-6 flex items-center gap-3 border-b-4 border-black dark:border-white/20 pb-3 inline-block">
                 <Code2 size={28} /> Tech Stack Decisions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {stackDetails.map((item, i) => (
                    <div key={i} className="flex flex-col h-full border-4 border-black dark:border-neo-dark-border p-4 md:p-5 bg-white dark:bg-neo-dark-surface shadow-neo dark:shadow-neo-dark hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg dark:hover:shadow-neo-lg-dark transition-all group min-w-0">
                       <div className="mb-4 w-full">
                          <span className="bg-black dark:bg-white text-neo-blue dark:text-black font-black uppercase text-xs md:text-sm tracking-wider px-2 py-1 shadow-sm group-hover:bg-neo-blue group-hover:text-black transition-colors inline-block max-w-full break-words leading-tight">
                             {item.name}
                          </span>
                       </div>
                       <p className="font-mono text-xs md:text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-grow">
                          {item.reason}
                       </p>
                    </div>
                 ))}
              </div>
           </div>

           {/* Challenges */}
           <div className="bg-gray-100 dark:bg-zinc-900 p-6 md:p-8 border-4 border-black dark:border-gray-600 border-dashed relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                 <AlertTriangle size={120} />
              </div>
              <h3 className="font-black uppercase text-xl mb-4 relative z-10">Development Hurdles & Learnings</h3>
              <ul className="space-y-3 font-mono text-sm md:text-base opacity-90 relative z-10">
                 {challenges.map((challenge, i) => (
                    <li key={i} className="flex gap-3">
                       <span className="text-neo-pink font-bold">»</span>
                       {challenge}
                    </li>
                 ))}
              </ul>
           </div>
        </div>
        
        {/* Footer padding */}
        <div className="h-10"></div>
      </div>
    </div>
  );
};

export default ProjectCaseStudy;
