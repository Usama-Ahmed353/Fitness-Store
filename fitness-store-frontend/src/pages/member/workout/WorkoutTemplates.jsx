import React from 'react';
import { motion } from 'framer-motion';
import { Play, Copy, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/hooks/useLanguage';

export default function WorkoutTemplates({ templates, onLoadTemplate, onDeleteTemplate }) {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (templates.length === 0) {
    return (
      <div className={`p-8 rounded-lg border ${borderColor} text-center`}>
        <p className={mutedColor}>No templates yet. Create a workout routine and save it as a template!</p>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
      <p className={`text-sm ${mutedColor}`}>{templates.length} saved template{templates.length !== 1 ? 's' : ''}</p>

      <div className="grid gap-4">
        {templates.map((template, idx) => (
          <motion.div
            key={template.id}
            variants={itemVariants}
            className={`${bgColor} p-6 rounded-lg border ${borderColor} hover:border-gray-500 transition`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${textColor}`}>{template.name}</h3>
                <p className={`${mutedColor} text-sm mt-1`}>
                  {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onLoadTemplate(template)}
                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden md:inline text-sm">Start</span>
                </motion.button>

                {onDeleteTemplate && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDeleteTemplate(template.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-2">
              {template.exercises.map((exercise, eIdx) => (
                <motion.div
                  key={eIdx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: eIdx * 0.05 }}
                  className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}
                >
                  <div className="flex-1">
                    <p className={`font-medium ${textColor}`}>{exercise.name}</p>
                    <p className={`text-sm ${mutedColor}`}>
                      {exercise.target && `${exercise.target.sets} x ${exercise.target.reps}` || 'Custom'}
                    </p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'} ${mutedColor}`}>
                    {exercise.muscleGroup}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
