import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Copy, Save, Dumbbell, Clock, Weight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';
import { estimateOneRepMax } from '@/utils/workoutCalculator';

export default function LogWorkout({
  workoutData,
  onAddExercise,
  onUpdateExercise,
  onAddSet,
  onRemoveExercise,
  onSave,
  onSaveTemplate
}) {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [showExerciseSearch, setShowExerciseSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedCardio, setSelectedCardio] = useState(null);

  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300';

  const handleAddCardio = () => {
    if (selectedCardio && selectedCardio.type) {
      onAddExercise({
        name: selectedCardio.type,
        muscleGroup: 'cardio',
        type: 'cardio',
        sets: [{ duration: selectedCardio.duration || 30, distance: selectedCardio.distance || 0, calories: selectedCardio.calories || 0 }]
      });
      setSelectedCardio(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Workout Info */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        <h3 className={`text-xl font-semibold ${textColor}`}>Workout Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium ${mutedColor} mb-2`}>Date</label>
            <input
              type="date"
              value={workoutData.date}
              onChange={(e) => onUpdateExercise(null, { date: e.target.value })}
              className={`w-full px-3 py-2 rounded border ${inputBg} ${textColor}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${mutedColor} mb-2`}>Start Time</label>
            <input
              type="time"
              value={workoutData.startTime || ''}
              onChange={(e) => onUpdateExercise(null, { startTime: e.target.value })}
              className={`w-full px-3 py-2 rounded border ${inputBg} ${textColor}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${mutedColor} mb-2`}>End Time</label>
            <input
              type="time"
              value={workoutData.endTime || ''}
              onChange={(e) => onUpdateExercise(null, { endTime: e.target.value })}
              className={`w-full px-3 py-2 rounded border ${inputBg} ${textColor}`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${mutedColor} mb-2`}>Notes</label>
          <textarea
            value={workoutData.notes}
            onChange={(e) => onUpdateExercise(null, { notes: e.target.value })}
            placeholder="How did the workout feel? Any observations?"
            className={`w-full px-3 py-2 rounded border ${inputBg} ${textColor} resize-none h-20`}
          />
        </div>
      </motion.div>

      {/* Exercises Added */}
      {workoutData.exercises.length > 0 && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          <h3 className={`text-xl font-semibold ${textColor}`}>Exercises ({workoutData.exercises.length})</h3>

          {workoutData.exercises.map((exercise, idx) => (
            <motion.div key={idx} variants={itemVariants} className={`${bgColor} p-5 rounded-lg border ${borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className={`text-lg font-semibold ${textColor}`}>{exercise.name}</p>
                  <p className={`${mutedColor} text-sm`}>{exercise.muscleGroup}</p>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAddSet(idx)}
                    className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-sm font-medium transition"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onRemoveExercise(idx)}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm font-medium transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Sets */}
              <div className="space-y-3">
                {exercise.sets.map((set, setIdx) => (
                  <div key={setIdx} className="grid grid-cols-12 gap-2">
                    <div className={`col-span-2 px-2 py-2 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={`text-xs ${mutedColor}`}>Set {setIdx + 1}</p>
                    </div>

                    {exercise.type !== 'cardio' ? (
                      <>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => {
                            const updated = [...exercise.sets];
                            updated[setIdx].reps = parseInt(e.target.value) || 0;
                            onUpdateExercise(idx, { sets: updated });
                          }}
                          placeholder="Reps"
                          className={`col-span-3 px-2 py-2 rounded border ${inputBg} ${textColor} text-sm`}
                        />

                        <input
                          type="number"
                          step="2.5"
                          value={set.weight}
                          onChange={(e) => {
                            const updated = [...exercise.sets];
                            updated[setIdx].weight = parseFloat(e.target.value) || 0;
                            onUpdateExercise(idx, { sets: updated });
                          }}
                          placeholder="Weight (lbs)"
                          className={`col-span-3 px-2 py-2 rounded border ${inputBg} ${textColor} text-sm`}
                        />

                        {set.weight && set.reps && (
                          <div className={`col-span-4 px-2 py-2 rounded ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <p className={`text-xs ${mutedColor}`}>
                              1RM: {estimateOneRepMax(set.weight, set.reps).toFixed(1)} lbs
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <input
                          type="number"
                          value={set.duration || ''}
                          onChange={(e) => {
                            const updated = [...exercise.sets];
                            updated[setIdx].duration = parseInt(e.target.value) || 0;
                            onUpdateExercise(idx, { sets: updated });
                          }}
                          placeholder="Min"
                          className={`col-span-3 px-2 py-2 rounded border ${inputBg} ${textColor} text-sm`}
                        />

                        <input
                          type="number"
                          value={set.distance || ''}
                          onChange={(e) => {
                            const updated = [...exercise.sets];
                            updated[setIdx].distance = parseFloat(e.target.value) || 0;
                            onUpdateExercise(idx, { sets: updated });
                          }}
                          placeholder="Distance (mi)"
                          className={`col-span-3 px-2 py-2 rounded border ${inputBg} ${textColor} text-sm`}
                        />

                        <input
                          type="number"
                          value={set.calories || ''}
                          onChange={(e) => {
                            const updated = [...exercise.sets];
                            updated[setIdx].calories = parseInt(e.target.value) || 0;
                            onUpdateExercise(idx, { sets: updated });
                          }}
                          placeholder="Cals"
                          className={`col-span-3 px-2 py-2 rounded border ${inputBg} ${textColor} text-sm`}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Exercise */}
      <motion.div variants={itemVariants} className="space-y-3">
        <button
          onClick={() => setShowExerciseSearch(true)}
          className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border-2 border-dashed border-blue-500 rounded-lg text-blue-400 font-medium transition flex items-center justify-center gap-2"
        >
          <Dumbbell className="w-5 h-5" />
          Add Strength Exercise
        </button>

        {/* Cardio Form */}
        <div className={`${bgColor} p-4 rounded-lg border ${borderColor} space-y-3`}>
          <p className={`font-medium ${textColor}`}>Add Cardio</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <input
              type="text"
              value={selectedCardio?.type || ''}
              onChange={(e) => setSelectedCardio(prev => ({ ...prev, type: e.target.value }))}
              placeholder="Type (Running...)"
              className={`px-2 py-2 rounded border ${inputBg} ${textColor} text-sm`}
            />
            <input
              type="number"
              value={selectedCardio?.duration || ''}
              onChange={(e) => setSelectedCardio(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
              placeholder="Minutes"
              className={`px-2 py-2 rounded border ${inputBg} ${textColor} text-sm`}
            />
            <input
              type="number"
              step="0.1"
              value={selectedCardio?.distance || ''}
              onChange={(e) => setSelectedCardio(prev => ({ ...prev, distance: parseFloat(e.target.value) || 0 }))}
              placeholder="Distance (mi)"
              className={`px-2 py-2 rounded border ${inputBg} ${textColor} text-sm`}
            />
            <input
              type="number"
              value={selectedCardio?.calories || ''}
              onChange={(e) => setSelectedCardio(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
              placeholder="Calories"
              className={`px-2 py-2 rounded border ${inputBg} ${textColor} text-sm`}
            />
          </div>
          <button
            onClick={handleAddCardio}
            className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium transition text-sm"
          >
            Add Cardio
          </button>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSave}
          disabled={workoutData.exercises.length === 0}
          className="flex-1 px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Workout
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowTemplateForm(!showTemplateForm)}
          disabled={workoutData.exercises.length === 0}
          className="px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-purple-500 text-purple-400 rounded-lg font-medium transition"
        >
          Save Template
        </motion.button>
      </div>

      {/* Save Template Form */}
      {showTemplateForm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${bgColor} p-4 rounded-lg border ${borderColor} space-y-3`}
        >
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template name (e.g., Upper Body A)"
            className={`w-full px-3 py-2 rounded border ${inputBg} ${textColor}`}
          />
          <button
            onClick={() => {
              if (templateName) {
                onSaveTemplate(templateName);
                setTemplateName('');
                setShowTemplateForm(false);
              }
            }}
            className="w-full px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-medium transition"
          >
            Save as Template
          </button>
        </motion.div>
      )}
    </div>
  );
}
