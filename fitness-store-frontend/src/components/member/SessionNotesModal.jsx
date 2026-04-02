import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../hooks/useLanguage';
import { X, Dumbbell, Lightbulb, Calendar } from 'lucide-react';

/**
 * SessionNotesModal - View session notes added by trainer
 */
const SessionNotesModal = ({ session, onClose }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  if (!session.notes) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-xl shadow-2xl w-full max-w-2xl my-8 overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              {t('member.sessions.sessionNotes') || 'Session Notes'}
            </h2>
            <p
              className={`text-sm mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {session.trainerName} • {session.date.toLocaleDateString('en-US')}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${
              isDark
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Exercises */}
          <div>
            <h3
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              <Dumbbell className="w-5 h-5" />
              {t('member.sessions.exercisesDone') || 'Exercises Done'}
            </h3>
            <div className="space-y-3">
              {session.notes.exercises.map((exercise, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                >
                  <p
                    className={`font-bold mb-2 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {exercise.name}
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {t('member.sessions.sets') || 'Sets'}
                      </p>
                      <p
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {exercise.sets}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {t('member.sessions.reps') || 'Reps'}
                      </p>
                      <p
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {exercise.reps}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-semibold ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {t('member.sessions.weight') || 'Weight'}
                      </p>
                      <p
                        className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {exercise.weight}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {session.notes.feedback && (
            <div>
              <h3
                className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                💬 {t('member.sessions.trainerFeedback') || 'Trainer Feedback'}
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  isDark
                    ? 'bg-blue-900/20 border border-blue-800'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <p
                  className={`text-sm ${
                    isDark ? 'text-blue-200' : 'text-blue-800'
                  }`}
                >
                  {session.notes.feedback}
                </p>
              </div>
            </div>
          )}

          {/* Next Session Plan */}
          {session.notes.nextSessionPlan && (
            <div>
              <h3
                className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Calendar className="w-5 h-5" />
                {t('member.sessions.nextSessionPlan') || 'Next Session Plan'}
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}
              >
                <p
                  className={`text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {session.notes.nextSessionPlan}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-6 border-t flex gap-3 ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-lg font-semibold bg-accent text-white hover:bg-accent/90 transition-all"
          >
            {t('member.sessions.close') || 'Close'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SessionNotesModal;
