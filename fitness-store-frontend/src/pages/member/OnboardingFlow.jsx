import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin, Zap, BarChart3, Heart } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

// Mock data
const mockGyms = [
  {
    id: 'gym-1',
    name: 'Times Square, New York',
    address: '404 W 42nd St, New York, NY 10036',
    distance: '0.5 miles away',
    amenities: ['Pool', 'Rock Climbing', 'Sauna'],
    lat: 40.7505,
    lng: -73.9867,
  },
  {
    id: 'gym-2',
    name: 'East Village, New York',
    address: '128 E Houston St, New York, NY 10002',
    distance: '1.2 miles away',
    amenities: ['Boxing Ring', 'Spinning Studio'],
    lat: 40.7214,
    lng: -73.9776,
  },
  {
    id: 'gym-3',
    name: 'Midtown, New York',
    address: '750 3rd Ave, New York, NY 10017',
    distance: '2.1 miles away',
    amenities: ['Olympic Pool', 'Basketball Court'],
    lat: 40.7528,
    lng: -73.9755,
  },
];

const plans = [
  { id: 'base', name: 'Base', price: '$9.99/mo', features: ['Home gym access', 'Locker rooms', '2 guest passes/year'] },
  { id: 'peak', name: 'Peak', price: '$21.99/mo', features: ['All Base features', 'Unlimited tanning', 'HydroMassage'] },
  { id: 'peak-results', name: 'Peak Results', price: '$29.99/mo', features: ['All Peak features', '1 PT session/mo', 'Nutrition app'] },
  { id: 'peak-plus', name: 'Peak Plus', price: '$34.99/mo', features: ['All Peak Results', 'Unlimited Crunch+', 'Nutrition coaching'] },
];

const goalOptions = [
  { id: 'lose-weight', label: 'Lose Weight', icon: '⚖️' },
  { id: 'build-muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'endurance', label: 'Improve Endurance', icon: '🏃' },
  { id: 'flexibility', label: 'Flexibility', icon: '🧘' },
  { id: 'general', label: 'General Fitness', icon: '✨' },
];

const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced'];

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [fitnessLevel, setFitnessLevel] = useState('Beginner');
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredGyms = mockGyms.filter((gym) =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGoalToggle = (goalId) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId]
    );
  };

  const handleNextStep = async () => {
    if (step === 2 && !selectedGym) {
      toast.error('Please select a gym');
      return;
    }
    if (step === 3 && !selectedPlan) {
      toast.error('Please select a plan');
      return;
    }
    if (step === 4 && selectedGoals.length === 0) {
      toast.error('Please select at least one goal');
      return;
    }

    if (step === 4) {
      setIsSubmitting(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Save onboarding data
        const onboardingData = {
          gymId: selectedGym,
          planId: selectedPlan,
          goals: selectedGoals,
          fitnessLevel,
          daysPerWeek,
        };
        
        localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
        toast.success('Welcome to CrunchFit!');
        navigate('/member/dashboard');
      } catch (error) {
        toast.error('Failed to complete onboarding');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-dark-navy via-dark-navy/95 to-accent/5 py-8 px-4"
    >
      <div className="max-w-2xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <motion.div
                key={s}
                animate={{
                  backgroundColor: s <= step ? '#E94560' : '#2B3E50',
                  scale: s === step ? 1.1 : 1,
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white cursor-pointer"
                onClick={() => s < step && setStep(s)}
              >
                {s}
              </motion.div>
            ))}
          </div>
          <div className="h-1 bg-accent/20 rounded-full overflow-hidden">
            <motion.div
              layout
              className="h-full bg-accent"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Welcome Carousel */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="default" className="border border-accent/30 p-8">
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2">Welcome to CrunchFit Pro!</h1>
                  <p className="text-light-bg/70">Let's get you started on your fitness journey</p>
                </div>

                {/* Carousel */}
                <div className="space-y-6 mb-8">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="h-64 rounded-lg bg-gradient-to-br from-accent/20 to-secondary/20 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="text-6xl mb-4">💪</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Crush Your Goals</h2>
                    <p className="text-light-bg/80">
                      Our certified trainers and community will support every step of your journey
                    </p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.2 }}
                    className="h-64 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="text-6xl mb-4">📅</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Book Classes Easily</h2>
                    <p className="text-light-bg/80">
                      Access 100+ group fitness classes and track your workouts
                    </p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.4 }}
                    className="h-64 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Track Your Progress</h2>
                    <p className="text-light-bg/80">
                      Monitor your achievements and celebrate every milestone
                    </p>
                  </motion.div>
                </div>

                <Button onClick={handleNextStep} variant="primary" size="lg" className="w-full">
                  Get Started
                  <ChevronRight size={20} className="ml-2" />
                </Button>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: Find Your Gym */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="default" className="border border-accent/30 p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Find Your Gym</h2>
                <p className="text-light-bg/70 mb-6">
                  Search for a Crunch location near you
                </p>

                {/* Search */}
                <div className="mb-6">
                  <Input
                    placeholder="Search gym by location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Gym List */}
                <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
                  {filteredGyms.map((gym) => (
                    <motion.div
                      key={gym.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedGym(gym.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedGym(gym.id);
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                        selectedGym === gym.id
                          ? 'border-accent bg-accent/10'
                          : 'border-accent/20 hover:border-accent/50'
                      }`}
                    >
                      <div className="flex items-start justify-between pointer-events-none">
                        <div>
                          <h3 className="font-bold text-white mb-1">{gym.name}</h3>
                          <p className="text-light-bg/70 text-sm mb-2 flex items-center gap-2">
                            <MapPin size={14} />
                            {gym.address}
                          </p>
                          <p className="text-accent text-xs mb-2">{gym.distance}</p>
                          <div className="flex gap-2">
                            {gym.amenities.map((amenity, idx) => (
                              <span key={idx} className="px-2 py-1 rounded-full bg-accent/20 text-accent text-xs pointer-events-auto">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        {selectedGym === gym.id && (
                          <div className="text-accent text-xl">✓</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handlePrevStep} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleNextStep} variant="primary" className="flex-1">
                    Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Pick Your Plan */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="default" className="border border-accent/30 p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
                <p className="text-light-bg/70 mb-8">
                  Select a membership plan that works for you
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {plans.map((plan) => (
                    <motion.button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      whileHover={{ y: -5 }}
                      className={`p-6 rounded-lg border-2 transition-all text-left ${
                        selectedPlan === plan.id
                          ? 'border-accent bg-accent/10'
                          : 'border-accent/20 hover:border-accent/50'
                      }`}
                    >
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="text-2xl font-bold text-accent mb-4">{plan.price}</div>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="text-light-bg/80 text-sm flex items-center gap-2">
                            <Zap size={14} className="text-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.button>
                  ))}
                </div>

                {/* Mock Stripe Form */}
                {selectedPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-dark-navy/50 border border-accent/20 rounded-lg p-6 mb-8"
                  >
                    <h3 className="text-lg font-bold text-white mb-4">Payment Details</h3>
                    <div className="space-y-4">
                      <Input
                        placeholder="Cardholder Name"
                        className="w-full"
                      />
                      <Input
                        placeholder="Card Number (4242 4242 4242 4242)"
                        className="w-full"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" />
                        <Input placeholder="CVC" />
                      </div>
                    </div>
                    <p className="text-light-bg/60 text-xs mt-4">
                      This is a demo. Use card 4242 4242 4242 4242 for testing.
                    </p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button onClick={handlePrevStep} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleNextStep} variant="primary" className="flex-1" disabled={!selectedPlan}>
                    Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: Set Your Goals */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card variant="default" className="border border-accent/30 p-8">
                <h2 className="text-3xl font-bold text-white mb-2">Set Your Goals</h2>
                <p className="text-light-bg/70 mb-8">
                  Tell us about your fitness objectives
                </p>

                {/* Goals */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">What are your goals?</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {goalOptions.map((goal) => (
                      <motion.button
                        key={goal.id}
                        onClick={() => handleGoalToggle(goal.id)}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          selectedGoals.includes(goal.id)
                            ? 'border-accent bg-accent/20'
                            : 'border-accent/20 hover:border-accent/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{goal.icon}</div>
                        <p className="font-semibold text-white text-sm">{goal.label}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Fitness Level */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">What's your fitness level?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {fitnessLevels.map((level) => (
                      <motion.button
                        key={level}
                        onClick={() => setFitnessLevel(level)}
                        whileHover={{ scale: 1.05 }}
                        className={`p-4 rounded-lg border-2 transition-all font-semibold ${
                          fitnessLevel === level
                            ? 'border-accent bg-accent/20 text-white'
                            : 'border-accent/20 text-light-bg/80 hover:border-accent/50'
                        }`}
                      >
                        {level}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Days Per Week Slider */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Days per week</h3>
                    <span className="text-2xl font-bold text-accent">{daysPerWeek}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                    className="w-full accent-accent"
                  />
                  <div className="flex justify-between text-light-bg/60 text-xs mt-2">
                    <span>1 day</span>
                    <span>7 days</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handlePrevStep} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    variant="primary"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Setting Up...' : 'Complete Onboarding'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OnboardingFlow;
