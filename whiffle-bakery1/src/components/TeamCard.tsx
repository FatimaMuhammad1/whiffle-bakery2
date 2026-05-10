import React from 'react';
import { Mail, Instagram, Linkedin } from 'lucide-react';

interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
  image: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ name, role, bio, image }) => {
  return (
    <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
      <div className="relative h-80 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
          <div className="flex gap-4">
            <button className="p-2 bg-cream/20 backdrop-blur-md rounded-full text-cream hover:bg-primary transition-colors">
              <Instagram size={18} />
            </button>
            <button className="p-2 bg-cream/20 backdrop-blur-md rounded-full text-cream hover:bg-primary transition-colors">
              <Linkedin size={18} />
            </button>
            <button className="p-2 bg-cream/20 backdrop-blur-md rounded-full text-cream hover:bg-primary transition-colors">
              <Mail size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-heading text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="font-body text-sm font-semibold text-primary uppercase tracking-wider mb-3">
          {role}
        </p>
        <p className="font-body text-muted-foreground text-sm leading-relaxed">
          {bio}
        </p>
      </div>
    </div>
  );
};

export default TeamCard;
