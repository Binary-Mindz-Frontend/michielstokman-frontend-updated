'use client';

import DynamicSectionHeader from '@/components/main/DynamicSectionHeader/DynamicSectionHeader';
import GrowthSlider from '@/components/main/GrowthSlider/GrowthSlider';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

export default function ProfilePage() {
  const [growthFocusValues, setGrowthFocusValues] = useState<Record<string, number>>({
    'Desire & Relationship': 5,
    'Life & Purpose': 8,
    'Career & Money': 4,
    'Show Your True Self': 6,
    'Sexuality & Life Energy': 7,
    'Fear & Freedom': 3,
    'Health & Body': 9,
    Enlightenment: 5,
  });

  // Slider change handler
  const handleSliderChange = (key: string, newValue: number) => {
    setGrowthFocusValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleUpdate = () => {
    console.log('Updated Preferences:', growthFocusValues);
    alert('Preferences updated successfully!');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header Section */}
      <DynamicSectionHeader title="Michiel Stockman" description="Discovering" />

      <div className="space-y-4">
        {/* Daily Credits Card (Same to Same) */}
        <div className="border-primary/20 rounded-md border p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-dark-primary text-sm font-semibold tracking-wider uppercase">
              Daily Credits
            </h3>
            <span className="text-dark-primary text-lg font-semibold">3/3 Remaining</span>
          </div>
          <Progress value={90} className="[&>div]:bg-primary bg-primary/20 h-2" />
          <p className="text-secondary mt-3 text-sm">
            1 credit = 1 full story or meditation. Resets daily.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-6">
          <div className="border-primary/20 rounded-md border p-6 text-center">
            <h4 className="text-dark-primary font-serif text-3xl font-bold">7</h4>
            <p className="text-secondary mt-1 text-[12px]">Reflections</p>
          </div>
          <div className="border-primary/20 rounded-md border p-6 text-center">
            <h4 className="text-dark-primary font-serif text-3xl font-bold">8.3</h4>
            <p className="text-secondary mt-1 text-[12px]">Avg Resonance</p>
          </div>
        </div>
      </div>

      {/* Personal Details Grid */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-8 pt-2.5">
        <DetailItem label="Age" value="12" />
        <DetailItem label="Country" value="United States" />
        <DetailItem label="City" value="New York" />
        <DetailItem label="Height" value="6ft" />
        <DetailItem label="Education" value="Bachelors" />
        <DetailItem label="Annual Income" value="Bachelors" />
        <DetailItem label="Gender" value="Male" />
        <DetailItem label="Sexual Orientation" value="Yes" />
      </div>

      <div className="space-y-6 pt-6">
        <h2 className="text-dark-primary border-muted/20 border-b pb-4 font-serif text-xl font-bold">
          Your Growth Focus
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          {Object.entries(growthFocusValues).map(([key, val]) => (
            <GrowthSlider
              key={key}
              label={key}
              value={val}
              onChange={(newValue) => handleSliderChange(key, newValue)}
            />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4 pt-8">
        <Button onClick={handleUpdate} className="btn-styles">
          Update Preferences
        </Button>
        <Button
          variant="outline"
          className="btn-styles text-error border-error hover:bg-error/10 hover:text-error/90"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-primary font-medium">{label}</p>
      <p className="text-dark-primary font-serif text-xl font-semibold">{value}</p>
    </div>
  );
}
