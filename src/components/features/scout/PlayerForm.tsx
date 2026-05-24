import React, { useState } from 'react';
import { Button } from '../../ui/Button';

interface PlayerFormProps {
  onSubmit: (player: {
    name: string;
    age: number;
    role: 'Batsman' | 'Bowler' | 'All-rounder' | 'WK';
    academy: string;
    city: string;
  }) => void;
  isLoading?: boolean;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState<'Batsman' | 'Bowler' | 'All-rounder' | 'WK'>('Batsman');
  const [academy, setAcademy] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Player name is required.';
    } else if (name.trim().length > 100) {
      newErrors.name = 'Name must be under 100 characters.';
    }
    
    const parsedAge = parseInt(age, 10);
    if (!age) {
      newErrors.age = 'Age is required.';
    } else if (isNaN(parsedAge) || parsedAge < 10 || parsedAge > 35) {
      newErrors.age = 'Age must be between 10 and 35 (grassroots range).';
    }

    if (!academy.trim()) {
      newErrors.academy = 'Academy or School name is required.';
    }
    if (!city.trim()) {
      newErrors.city = 'Representing city is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: name.trim(),
        age: parseInt(age, 10),
        role,
        academy: academy.trim(),
        city: city.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-bg-surface border border-border-subtle p-6 rounded-lg max-w-xl mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      <h2 className="text-2xl font-bold font-display text-text-primary border-b border-border-subtle pb-3 tracking-wide">
        🏏 Player Profile Registry
      </h2>
      
      <div>
        <label htmlFor="player-name" className="block text-sm font-semibold text-text-secondary mb-1.5">
          Full Name
        </label>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Yashasvi Jaiswal"
          className="w-full bg-bg-primary border border-border-subtle text-text-primary px-4 py-2.5 rounded focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
          disabled={isLoading}
        />
        {errors.name && <p className="text-brand-red text-xs mt-1.5 font-semibold">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="player-age" className="block text-sm font-semibold text-text-secondary mb-1.5">
            Age (10 - 35)
          </label>
          <input
            id="player-age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g., 18"
            className="w-full bg-bg-primary border border-border-subtle text-text-primary px-4 py-2.5 rounded focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            disabled={isLoading}
          />
          {errors.age && <p className="text-brand-red text-xs mt-1.5 font-semibold">{errors.age}</p>}
        </div>

        <div>
          <label htmlFor="player-role" className="block text-sm font-semibold text-text-secondary mb-1.5">
            Playing Role
          </label>
          <select
            id="player-role"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full bg-bg-primary border border-border-subtle text-text-primary px-4 py-2.5 rounded focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            disabled={isLoading}
          >
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="WK">Wicket Keeper (WK)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="player-academy" className="block text-sm font-semibold text-text-secondary mb-1.5">
          Cricket Academy / School / Club
        </label>
        <input
          id="player-academy"
          type="text"
          value={academy}
          onChange={(e) => setAcademy(e.target.value)}
          placeholder="e.g., Shivaji Park Gymkhana"
          className="w-full bg-bg-primary border border-border-subtle text-text-primary px-4 py-2.5 rounded focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
          disabled={isLoading}
        />
        {errors.academy && <p className="text-brand-red text-xs mt-1.5 font-semibold">{errors.academy}</p>}
      </div>

      <div>
        <label htmlFor="player-city" className="block text-sm font-semibold text-text-secondary mb-1.5">
          City / Region
        </label>
        <input
          id="player-city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g., Mumbai"
          className="w-full bg-bg-primary border border-border-subtle text-text-primary px-4 py-2.5 rounded focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
          disabled={isLoading}
        />
        {errors.city && <p className="text-brand-red text-xs mt-1.5 font-semibold">{errors.city}</p>}
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Register Profile & Proceed
      </Button>
    </form>
  );
};
