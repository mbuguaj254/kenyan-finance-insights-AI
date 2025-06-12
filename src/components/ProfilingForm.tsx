import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { UserProfile } from "@/types/user";

interface ProfilingFormProps {
  onComplete: (profile: UserProfile) => void;
}

const ProfilingForm = ({ onComplete }: ProfilingFormProps) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    transport: [],
    consumptionHabits: [],
    concerns: []
  });

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = () => {
    onComplete(profile as UserProfile);
  };

  const transportOptions = [
    "Matatu/Bus", "Personal Car", "Boda Boda", "Walking", 
    "Bicycle", "Uber/Taxi", "Tuk Tuk"
  ];

  const consumptionOptions = [
    "Basic foodstuffs (ugali, rice, beans)",
    "Imported goods",
    "Electronics and gadgets",
    "Fuel and energy",
    "Healthcare services",
    "Educational materials",
    "Construction materials"
  ];

  const professionSuggestions = [
    // Education Sector
    "Teacher", "Student", "Lecturer", "School Administrator", "Education Officer",
    // Healthcare
    "Doctor", "Nurse", "Clinical Officer", "Pharmacist", "Medical Technician",
    // Technology & Engineering  
    "Software Developer", "IT Specialist", "Engineer", "Data Analyst", "Tech Entrepreneur",
    // Business & Finance
    "Accountant", "Banker", "Financial Advisor", "Business Owner", "Entrepreneur",
    // Legal & Government
    "Lawyer", "Government Officer", "Police Officer", "Military Personnel", "Judge",
    // Agriculture & Environment
    "Farmer", "Agricultural Officer", "Veterinarian", "Environmental Scientist",
    // Transport & Logistics
    "Driver", "Pilot", "Mechanic", "Logistics Coordinator", "Boda Boda Operator",
    // Arts & Media
    "Journalist", "Artist", "Musician", "Content Creator", "Media Professional",
    // Retail & Hospitality
    "Shop Owner", "Restaurant Owner", "Tourism Professional", "Hotel Manager",
    // Construction & Real Estate
    "Contractor", "Architect", "Real Estate Agent", "Construction Worker",
    // Other
    "Consultant", "Freelancer", "Retiree", "Unemployed", "Self-Employed"
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="occupation">What is your occupation?</Label>
              <Input
                id="occupation"
                value={profile.occupation || ""}
                onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                placeholder="e.g., Teacher, Software Developer, Farmer"
                list="professions"
              />
              <datalist id="professions">
                {professionSuggestions.map((profession) => (
                  <option key={profession} value={profession} />
                ))}
              </datalist>
              <p className="text-sm text-gray-500 mt-1">
                Type or select from suggestions. AI will provide profession-specific analysis.
              </p>
            </div>
            
            <div>
              <Label>Income Level</Label>
              <RadioGroup 
                value={profile.incomeLevel} 
                onValueChange={(value) => setProfile({...profile, incomeLevel: value as any})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Below KSh 50,000/month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="middle" id="middle" />
                  <Label htmlFor="middle">KSh 50,000 - 200,000/month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">Above KSh 200,000/month</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Location</Label>
              <RadioGroup 
                value={profile.location} 
                onValueChange={(value) => setProfile({...profile, location: value as any})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urban" id="urban" />
                  <Label htmlFor="urban">Urban (City/Town)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rural" id="rural" />
                  <Label htmlFor="rural">Rural/Village</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Main modes of transport (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {transportOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={profile.transport?.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setProfile({
                            ...profile, 
                            transport: [...(profile.transport || []), option]
                          });
                        } else {
                          setProfile({
                            ...profile,
                            transport: profile.transport?.filter(t => t !== option)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Do you own property?</Label>
              <RadioGroup 
                value={profile.propertyOwner?.toString()} 
                onValueChange={(value) => setProfile({...profile, propertyOwner: value === "true"})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="prop-yes" />
                  <Label htmlFor="prop-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="prop-no" />
                  <Label htmlFor="prop-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="dependents">Number of dependents</Label>
              <Input
                id="dependents"
                type="number"
                min="0"
                value={profile.dependents || 0}
                onChange={(e) => setProfile({...profile, dependents: parseInt(e.target.value)})}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Do you own a business?</Label>
              <RadioGroup 
                value={profile.businessOwner?.toString()} 
                onValueChange={(value) => setProfile({...profile, businessOwner: value === "true"})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="biz-yes" />
                  <Label htmlFor="biz-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="biz-no" />
                  <Label htmlFor="biz-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Main consumption categories (select all that apply)</Label>
              <div className="space-y-2 mt-2">
                {consumptionOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={profile.consumptionHabits?.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setProfile({
                            ...profile, 
                            consumptionHabits: [...(profile.consumptionHabits || []), option]
                          });
                        } else {
                          setProfile({
                            ...profile,
                            consumptionHabits: profile.consumptionHabits?.filter(c => c !== option)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={option} className="text-sm">{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI-Powered User Profiling - Step {step} of 3</CardTitle>
        <CardDescription>
          Help our AI understand your situation to provide dynamic, reasoned analysis of the Finance Bill's impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStep()}
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-kenya-green hover:bg-kenya-green/90">
              Generate AI Analysis
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilingForm;
