import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../contexts/AuthContext';
import { useModal } from '../../contexts/ModalContext';
import { useToast } from '../../contexts/ToastContext';


const MoodAnalytics = () => {
  const { tasks } = useTasks();
  const { users } = useAuth();
  const { openModal } = useModal();
  const { showToast } = useToast();
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingMood, setAnalyzingMood] = useState(false);

  const getMoodStats = () => {
    const moodCounts = {
      '😊': 0, // Happy
      '😐': 0, // Neutral
      '😤': 0, // Frustrated
      '🤔': 0, // Thinking
      '💪': 0  // Motivated
    };

    const staffMoods = {};
    const moodTasks = {
      '😊': [], '😐': [], '😤': [], '🤔': [], '💪': []
    };
    const staffMoodTasks = {};
    
    tasks.forEach(task => {
      if (task.mood) {
        moodCounts[task.mood]++;
        moodTasks[task.mood].push(task);
        
        // Track per staff member
        if (task.assignedTo) {
          const user = users.find(u => u.id === task.assignedTo);
          if (user && user.role === 'staff') {
            if (!staffMoods[user.username]) {
              staffMoods[user.username] = {
                '😊': 0, '😐': 0, '😤': 0, '🤔': 0, '💪': 0
              };
              staffMoodTasks[user.username] = {
                '😊': [], '😐': [], '😤': [], '🤔': [], '💪': []
              };
            }
            staffMoods[user.username][task.mood]++;
            staffMoodTasks[user.username][task.mood].push(task);
          }
        }
      }
    });

    return { overall: moodCounts, byStaff: staffMoods, moodTasks, staffMoodTasks };
  };

  const getMoodColor = (mood) => {
    const colors = {
      '😊': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      '😐': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200', 
      '😤': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      '🤔': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      '💪': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[mood] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const getMoodLabel = (mood) => {
    const labels = {
      '😊': 'Happy',
      '😐': 'Neutral',
      '😤': 'Frustrated', 
      '🤔': 'Thinking',
      '💪': 'Motivated'
    };
    return labels[mood] || 'Unknown';
  };

  const { overall, byStaff, moodTasks, staffMoodTasks } = getMoodStats();

  const handleAIAnalysis = async () => {
    setAnalyzingMood(true);
    showToast('Analyzing team mood with AI...', 'info');
    
    try {
      const { generateMoodAnalysis } = await import('../../services/geminiService');
      const analysis = await generateMoodAnalysis({ overall, byStaff }, tasks, users);
      setAiAnalysis(analysis);
      showToast('AI analysis completed!', 'success');
    } catch (error) {
      console.error('AI Analysis failed:', error);
      showToast('AI analysis failed. Please try again.', 'error');
      // Fallback to basic analysis
      const analysis = generateFallbackAnalysis({ overall, byStaff }, tasks, users);
      setAiAnalysis(analysis);
    }
    
    setAnalyzingMood(false);
  };

  const generateFallbackAnalysis = (moodData, tasks, users) => {
    const totalMoods = Object.values(moodData.overall).reduce((sum, count) => sum + count, 0);
    
    if (totalMoods === 0) return 'No mood data available for analysis.';
    
    const tasksWithMood = tasks.filter(t => t.mood);
    const tasksWithRemarks = tasks.filter(t => t.mood && t.moodRemark);
    const frustratedCount = moodData.overall['😤'] || 0;
    const happyCount = moodData.overall['😊'] || 0;
    const motivatedCount = moodData.overall['💪'] || 0;
    const neutralCount = moodData.overall['😐'] || 0;
    const thinkingCount = moodData.overall['🤔'] || 0;
    
    // Calculate percentages
    const frustratedPct = Math.round((frustratedCount/totalMoods)*100);
    const happyPct = Math.round((happyCount/totalMoods)*100);
    const motivatedPct = Math.round((motivatedCount/totalMoods)*100);
    const neutralPct = Math.round((neutralCount/totalMoods)*100);
    const thinkingPct = Math.round((thinkingCount/totalMoods)*100);
    const positivePct = Math.round(((happyCount + motivatedCount)/totalMoods)*100);
    const negativePct = frustratedPct;
    
    // Analyze task completion by mood
    const completedTasks = tasksWithMood.filter(t => t.status === 'completed');
    const overdueTasks = tasksWithMood.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed');
    const highPriorityTasks = tasksWithMood.filter(t => t.priority === 'high');
    
    // Staff analysis
    const staffCount = Object.keys(moodData.byStaff).length;
    const mostFrustratedStaff = Object.entries(moodData.byStaff)
      .map(([name, moods]) => ({ name, frustrated: moods['😤'] || 0 }))
      .sort((a, b) => b.frustrated - a.frustrated)
      .slice(0, 3);
    
    const mostPositiveStaff = Object.entries(moodData.byStaff)
      .map(([name, moods]) => ({ name, positive: (moods['😊'] || 0) + (moods['💪'] || 0) }))
      .sort((a, b) => b.positive - a.positive)
      .slice(0, 3);
    
    // Common frustration themes from remarks
    const frustrationRemarks = tasksWithRemarks.filter(t => t.mood === '😤').map(t => t.moodRemark);
    const commonIssues = analyzeFrustrationThemes(frustrationRemarks);
    
    let analysis = '🤖 ARIX DETAILED TEAM MOOD ANALYSIS\n';
    analysis += '=====================================\n\n';
    
    // Executive Summary
    analysis += '📊 EXECUTIVE SUMMARY\n';
    analysis += '-------------------\n';
    analysis += `• Total mood entries: ${totalMoods} across ${tasksWithMood.length} tasks\n`;
    analysis += `• Staff providing feedback: ${staffCount} members\n`;
    analysis += `• Overall sentiment: ${getOverallSentiment(positivePct, negativePct, neutralPct)}\n`;
    analysis += `• Team morale score: ${calculateMoraleScore(moodData.overall)}/10\n\n`;
    
    // Mood Distribution
    analysis += '🎭 MOOD DISTRIBUTION\n';
    analysis += '------------------\n';
    analysis += `😊 Happy: ${happyCount} (${happyPct}%)\n`;
    analysis += `💪 Motivated: ${motivatedCount} (${motivatedPct}%)\n`;
    analysis += `😐 Neutral: ${neutralCount} (${neutralPct}%)\n`;
    analysis += `🤔 Thinking: ${thinkingCount} (${thinkingPct}%)\n`;
    analysis += `😤 Frustrated: ${frustratedCount} (${frustratedPct}%)\n\n`;
    
    // Key Insights
    analysis += '🔍 KEY INSIGHTS\n';
    analysis += '--------------\n';
    
    if (frustratedPct > 25) {
      analysis += `⚠️ CRITICAL: High frustration level (${frustratedPct}%) - Immediate attention required\n`;
    } else if (frustratedPct > 15) {
      analysis += `⚡ WARNING: Elevated frustration (${frustratedPct}%) - Monitor closely\n`;
    }
    
    if (positivePct > 60) {
      analysis += `✅ EXCELLENT: Strong positive sentiment (${positivePct}%)\n`;
    } else if (positivePct > 40) {
      analysis += `👍 GOOD: Healthy positive sentiment (${positivePct}%)\n`;
    } else {
      analysis += `📈 OPPORTUNITY: Low positive sentiment (${positivePct}%) - Focus on motivation\n`;
    }
    
    if (neutralPct > 40) {
      analysis += `😐 NOTICE: High neutral responses (${neutralPct}%) - Staff may be disengaged\n`;
    }
    
    analysis += '\n';
    
    // Performance Correlation
    analysis += '📈 PERFORMANCE CORRELATION\n';
    analysis += '-------------------------\n';
    analysis += `• Tasks completed: ${completedTasks.length}/${tasksWithMood.length} (${Math.round((completedTasks.length/tasksWithMood.length)*100)}%)\n`;
    analysis += `• Overdue tasks: ${overdueTasks.length} (${Math.round((overdueTasks.length/tasksWithMood.length)*100)}%)\n`;
    analysis += `• High priority tasks: ${highPriorityTasks.length}\n\n`;
    
    // Staff Spotlight
    analysis += '👥 STAFF SPOTLIGHT\n';
    analysis += '-----------------\n';
    if (mostFrustratedStaff.length > 0 && mostFrustratedStaff[0].frustrated > 0) {
      analysis += `🚨 Needs Support: ${mostFrustratedStaff.slice(0, 2).map(s => `${s.name} (${s.frustrated} frustrated)`).join(', ')}\n`;
    }
    if (mostPositiveStaff.length > 0 && mostPositiveStaff[0].positive > 0) {
      analysis += `⭐ Top Performers: ${mostPositiveStaff.slice(0, 2).map(s => `${s.name} (${s.positive} positive)`).join(', ')}\n`;
    }
    analysis += '\n';
    
    // Common Issues
    if (commonIssues.length > 0) {
      analysis += '🔧 COMMON FRUSTRATION THEMES\n';
      analysis += '---------------------------\n';
      commonIssues.forEach(issue => {
        analysis += `• ${issue}\n`;
      });
      analysis += '\n';
    }
    
    // Recommendations
    analysis += '💡 ARIX RECOMMENDATIONS\n';
    analysis += '----------------------\n';
    
    if (frustratedPct > 20) {
      analysis += '🎯 IMMEDIATE ACTIONS:\n';
      analysis += '• Schedule 1-on-1 meetings with frustrated staff\n';
      analysis += '• Review workload distribution and deadlines\n';
      analysis += '• Identify and address resource constraints\n\n';
    }
    
    if (positivePct < 40) {
      analysis += '🚀 MOTIVATION BOOSTERS:\n';
      analysis += '• Recognize and celebrate recent achievements\n';
      analysis += '• Provide clear career development paths\n';
      analysis += '• Implement team building activities\n\n';
    }
    
    if (neutralPct > 35) {
      analysis += '🎪 ENGAGEMENT STRATEGIES:\n';
      analysis += '• Increase task variety and autonomy\n';
      analysis += '• Gather detailed feedback on job satisfaction\n';
      analysis += '• Create opportunities for skill development\n\n';
    }
    
    analysis += '📅 NEXT STEPS:\n';
    analysis += '• Monitor mood trends weekly\n';
    analysis += '• Follow up on implemented recommendations\n';
    analysis += '• Conduct team satisfaction survey\n';
    analysis += `• Schedule next analysis: ${new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}\n\n`;
    
    analysis += `Generated by Arix AI on ${new Date().toLocaleString()}\n`;
    analysis += '---\n';
    analysis += 'This analysis is based on staff mood feedback and task data.\n';
    analysis += 'For best results, encourage regular mood updates from all team members.';
    
    return analysis;
  };
  
  const analyzeFrustrationThemes = (remarks) => {
    const themes = [];
    const keywords = {
      'workload': ['overloaded', 'too much', 'overwhelmed', 'busy', 'stress'],
      'deadlines': ['deadline', 'time', 'rush', 'urgent', 'late'],
      'resources': ['need help', 'stuck', 'blocked', 'waiting', 'support'],
      'clarity': ['unclear', 'confused', 'understand', 'direction', 'requirements']
    };
    
    const remarkText = remarks.join(' ').toLowerCase();
    
    Object.entries(keywords).forEach(([theme, words]) => {
      if (words.some(word => remarkText.includes(word))) {
        themes.push(theme.charAt(0).toUpperCase() + theme.slice(1) + ' concerns');
      }
    });
    
    return themes.length > 0 ? themes : ['General task-related frustrations'];
  };
  
  const getOverallSentiment = (positive, negative, neutral) => {
    if (positive > 50) return 'Positive 😊';
    if (negative > 30) return 'Concerning 😤';
    if (neutral > 50) return 'Neutral 😐';
    return 'Mixed 🤔';
  };
  
  const calculateMoraleScore = (moods) => {
    const total = Object.values(moods).reduce((sum, count) => sum + count, 0);
    if (total === 0) return 5;
    
    const score = (
      (moods['😊'] || 0) * 10 +
      (moods['💪'] || 0) * 9 +
      (moods['🤔'] || 0) * 6 +
      (moods['😐'] || 0) * 5 +
      (moods['😤'] || 0) * 2
    ) / total;
    
    return Math.round(score * 10) / 10;
  };

  const showMoodTasks = (mood, staffName = null) => {
    const tasksToShow = staffName ? staffMoodTasks[staffName][mood] : moodTasks[mood];
    const title = staffName ? `${staffName}'s ${getMoodLabel(mood)} Tasks` : `All ${getMoodLabel(mood)} Tasks`;
    
    const taskListHtml = tasksToShow.map(task => {
      const user = users.find(u => u.id === task.assignedTo);
      return `
        <div class="bg-gray-50 p-3 rounded-lg mb-2">
          <div class="font-medium text-black">${task.text}</div>
          <div class="text-sm text-slate-600 mt-1">
            ${staffName ? '' : `Assigned to: ${user?.username || 'Unassigned'} | `}
            Priority: ${task.priority} | 
            Due: ${new Date(task.dueDate).toLocaleDateString()}
            ${task.moodUpdatedAt ? ` | Mood set: ${new Date(task.moodUpdatedAt).toLocaleDateString()}` : ''}
          </div>
          ${task.moodRemark ? `
            <div class="text-sm text-blue-700 mt-2 bg-blue-50 p-2 rounded">
              <strong>Remark:</strong> "${task.moodRemark}"
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    
    openModal(
      `${mood} ${title}`,
      tasksToShow.length > 0 ? taskListHtml : '<p class="text-slate-500 text-center py-4">No tasks found for this mood.</p>'
    );
  };
  const totalMoods = Object.values(overall).reduce((sum, count) => sum + count, 0);

  if (totalMoods === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-responsive-lg font-semibold mb-4 text-black dark:text-white">Team Mood Analytics</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center py-4 text-responsive-base">No mood data available yet. Staff can set their mood while working on tasks.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h3 className="text-responsive-lg font-semibold text-black dark:text-white">Team Mood Analytics</h3>
        <button
          onClick={handleAIAnalysis}
          disabled={analyzingMood || totalMoods === 0}
          className="bg-purple-600 dark:bg-purple-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-xs sm:text-sm font-medium hover:bg-purple-700 dark:hover:bg-purple-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center gap-2 self-start sm:self-auto"
        >
          {analyzingMood ? (
            <>
              <div className="animate-spin w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span className="hidden sm:inline">Analyzing...</span>
              <span className="sm:hidden">...</span>
            </>
          ) : (
            <>
              <span className="robot-hover">🤖</span> 
              <span className="hidden sm:inline">Arix Analysis</span>
              <span className="sm:hidden">Analysis</span>
            </>
          )}
        </button>
      </div>
      
      {/* Overall Mood Distribution */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-responsive-base font-medium mb-3 text-black dark:text-white">Overall Team Mood</h4>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {Object.entries(overall).map(([mood, count]) => (
            <div 
              key={mood} 
              className={`p-2 sm:p-3 rounded-md sm:rounded-lg text-center cursor-pointer hover:scale-105 transition-transform ${getMoodColor(mood)}`}
              onClick={() => showMoodTasks(mood)}
              title={`Click to see all ${getMoodLabel(mood)} tasks`}
            >
              <div className="text-xl sm:text-2xl mb-1">{mood}</div>
              <div className="text-xs sm:text-sm font-medium">{count}</div>
              <div className="text-xs hidden sm:block">{getMoodLabel(mood)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <div className="mb-4 sm:mb-6">
          <h4 className="text-responsive-base font-medium mb-3 text-black dark:text-white">🤖 Arix Mood Analysis & Recommendations</h4>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 rounded-lg border border-purple-200 dark:border-purple-700 space-y-4">
            <div>
              <h5 className="font-semibold text-purple-800 dark:text-purple-200">Summary</h5>
              <p className="text-sm text-gray-800 dark:text-gray-200">{aiAnalysis.summary}</p>
            </div>
            <div>
              <h5 className="font-semibold text-purple-800 dark:text-purple-200">Insights</h5>
              <p className="text-sm text-gray-800 dark:text-gray-200">{aiAnalysis.insights}</p>
            </div>
            <div>
              <h5 className="font-semibold text-purple-800 dark:text-purple-200">Recommendations</h5>
              <p className="text-sm text-gray-800 dark:text-gray-200">{aiAnalysis.recommendations}</p>
            </div>
            <div>
              <h5 className="font-semibold text-purple-800 dark:text-purple-200">Action Items</h5>
              <ul className="list-disc list-inside text-sm text-gray-800 dark:text-gray-200">
                {aiAnalysis.actionItems.split('\n').map((item, index) => item && <li key={index}>{item.replace(/^- /, '')}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Individual Staff Moods */}
      {Object.keys(byStaff).length > 0 && (
        <div>
          <h4 className="text-responsive-base font-medium mb-3 text-black dark:text-white">Individual Staff Moods</h4>
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(byStaff).map(([staffName, moods]) => (
              <div key={staffName} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="font-medium text-black dark:text-white mb-2 text-responsive-base">{staffName}</div>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  {Object.entries(moods).map(([mood, count]) => (
                    count > 0 && (
                      <span 
                        key={mood} 
                        className={`px-2 py-1 rounded text-xs cursor-pointer hover:scale-110 transition-transform ${getMoodColor(mood)}`}
                        onClick={() => showMoodTasks(mood, staffName)}
                        title={`Click to see ${staffName}'s ${getMoodLabel(mood)} tasks`}
                      >
                        {mood} {count}
                      </span>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodAnalytics;