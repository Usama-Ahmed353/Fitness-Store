import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Filter, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { getExercises, MUSCLE_GROUPS, EQUIPMENT_TYPES } from '@/utils/exerciseDatabase';

export default function ExerciseLibrary({ onSelectExercise }) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredExercises = useMemo(() => {
    return getExercises({
      search: searchQuery,
      muscleGroup: selectedMuscle,
      equipment: selectedEquipment
    });
  }, [searchQuery, selectedMuscle, selectedEquipment]);

  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300';

  const muscleGroupOptions = Object.values(MUSCLE_GROUPS).filter(m => m !== 'cardio');
  const colors = {
    chest: 'bg-red-500/20 text-red-400',
    back: 'bg-blue-500/20 text-blue-400',
    shoulders: 'bg-purple-500/20 text-purple-400',
    biceps: 'bg-cyan-500/20 text-cyan-400',
    triceps: 'bg-pink-500/20 text-pink-400',
    legs: 'bg-green-500/20 text-green-400',
    quads: 'bg-lime-500/20 text-lime-400',
    hamstrings: 'bg-yellow-500/20 text-yellow-400',
    glutes: 'bg-orange-500/20 text-orange-400',
    abs: 'bg-indigo-500/20 text-indigo-400'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="relative">
          <Search className={`absolute left-3 top-3 w-5 h-5 ${mutedColor}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises..."
            className={`w-full pl-10 pr-4 py-2 rounded border ${inputBg} ${textColor} placeholder:${mutedColor}`}
          />
        </div>

        {/* Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded border ${borderColor} ${mutedColor} hover:text-gray-200 transition`}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </motion.div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${bgColor} p-4 rounded-lg border ${borderColor} space-y-4`}
          >
            <div>
              <label className={`block text-sm font-medium ${mutedColor} mb-2`}>Muscle Group</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedMuscle('')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    selectedMuscle === '' ? 'bg-blue-500 text-white' : `border ${borderColor} ${mutedColor}`
                  }`}
                >
                  All
                </button>
                {muscleGroupOptions.map(muscle => (
                  <button
                    key={muscle}
                    onClick={() => setSelectedMuscle(muscle)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition capitalize ${
                      selectedMuscle === muscle ? 'bg-blue-500 text-white' : `border ${borderColor} ${mutedColor}`
                    }`}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${mutedColor} mb-2`}>Equipment</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedEquipment('')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    selectedEquipment === '' ? 'bg-blue-500 text-white' : `border ${borderColor} ${mutedColor}`
                  }`}
                >
                  All
                </button>
                {EQUIPMENT_TYPES.slice(0, 6).map(equipment => (
                  <button
                    key={equipment}
                    onClick={() => setSelectedEquipment(equipment)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      selectedEquipment === equipment ? 'bg-blue-500 text-white' : `border ${borderColor} ${mutedColor}`
                    }`}
                  >
                    {equipment}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise List */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
        <p className={`text-sm ${mutedColor}`}>
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
        </p>

        {filteredExercises.length > 0 ? (
          <div className="grid gap-3">
            {filteredExercises.map((exercise, idx) => (
              <motion.div
                key={exercise.id}
                variants={itemVariants}
                className={`${bgColor} p-4 rounded-lg border ${borderColor} hover:border-gray-500 transition cursor-pointer group`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`font-medium ${textColor}`}>{exercise.name}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full ${colors[exercise.muscleGroup] || 'bg-gray-500/20 text-gray-400'} capitalize`}>
                        {exercise.muscleGroup}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${borderColor} ${mutedColor}`}>
                        {exercise.equipment}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${borderColor} ${mutedColor}`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectExercise({
                      name: exercise.name,
                      muscleGroup: exercise.muscleGroup,
                      equipment: exercise.equipment,
                      difficulty: exercise.difficulty
                    })}
                    className="ml-4 p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-8 rounded-lg border ${borderColor} text-center`}
          >
            <p className={mutedColor}>No exercises found. Try adjusting your filters.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
