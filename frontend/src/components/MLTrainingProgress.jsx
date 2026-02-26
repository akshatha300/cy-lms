import React, { useState, useEffect } from 'react';
import {
  Brain,
  Activity,
  Zap,
  TrendingUp,
  Cpu,
  Database,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Gauge
} from 'lucide-react';

const MLTrainingProgress = ({ trainingJobs, models, metrics }) => {
  const [activeJobs, setActiveJobs] = useState([]);
  const [animatedMetrics, setAnimatedMetrics] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveJobs(trainingJobs?.filter(job => job.status === 'training') || []);
      setAnimatedMetrics(metrics || {});
    }, 100);
    return () => clearTimeout(timer);
  }, [trainingJobs, metrics]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'training': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-gradient-to-r from-green-500 to-green-600';
    if (progress >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    if (progress >= 20) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Training Overview Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">ML Model Training Dashboard</h2>
              <p className="text-green-100">Monitor and manage your machine learning model training</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{activeJobs.length}</div>
              <div className="text-sm text-green-100">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{models?.length || 0}</div>
              <div className="text-sm text-green-100">Total Models</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <Cpu className="w-5 h-5 text-blue-500" />
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{animatedMetrics.cpuUsage || 0}%</div>
          <div className="text-sm text-gray-500">CPU Usage</div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div 
              className="bg-blue-500 h-1 rounded-full transition-all duration-500"
              style={{ width: `${animatedMetrics.cpuUsage || 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <Database className="w-5 h-5 text-green-500" />
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Available
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{animatedMetrics.memoryUsage || 0}GB</div>
          <div className="text-sm text-gray-500">Memory Used</div>
          <div className="text-xs text-green-600 mt-1">16GB Total</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              Normal
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{animatedMetrics.gpuTemp || 0}°C</div>
          <div className="text-sm text-gray-500">GPU Temperature</div>
          <div className="text-xs text-yellow-600 mt-1">Optimal range</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-purple-500" />
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              Good
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{animatedMetrics.trainingSpeed || 0}</div>
          <div className="text-sm text-gray-500">Samples/sec</div>
          <div className="text-xs text-green-600 mt-1">+{animatedMetrics.speedImprovement || 0}% faster</div>
        </div>
      </div>

      {/* Active Training Jobs */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Active Training Jobs
          </h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <Pause className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {activeJobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(job.status)}`}>
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{job.modelName}</div>
                    <div className="text-sm text-gray-500">{job.algorithm} • {job.dataset}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{job.progress}%</div>
                    <div className="text-xs text-gray-500">Progress</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatTime(job.elapsedTime)}</div>
                    <div className="text-xs text-gray-500">Elapsed</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{formatTime(job.estimatedTime)}</div>
                    <div className="text-xs text-gray-500">Est. Remaining</div>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(job.progress)}`}
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              
              {/* Training Metrics */}
              <div className="grid grid-cols-4 gap-4 text-xs">
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Loss:</span>
                  <span className="font-medium">{job.currentLoss?.toFixed(4) || '0.0000'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-medium">{job.accuracy?.toFixed(2) || '0.00'}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Gauge className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">Epoch:</span>
                  <span className="font-medium">{job.currentEpoch || 0}/{job.totalEpochs || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">ETA:</span>
                  <span className="font-medium">{formatTime(job.ETA || 0)}</span>
                </div>
              </div>
            </div>
          ))}
          
          {activeJobs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <div className="font-medium">No active training jobs</div>
              <div className="text-sm">Start a new training job to see progress here</div>
            </div>
          )}
        </div>
      </div>

      {/* Model Performance Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
            Model Performance
          </h3>
          <div className="space-y-3">
            {models?.slice(0, 4).map((model) => (
              <div key={model.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    model.status === 'deployed' ? 'bg-green-500' :
                    model.status === 'training' ? 'bg-blue-500' :
                    model.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{model.name}</div>
                    <div className="text-xs text-gray-500">{model.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{model.accuracy}%</div>
                  <div className="text-xs text-gray-500">Accuracy</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Recent Completions
          </h3>
          <div className="space-y-3">
            {trainingJobs?.filter(job => job.status === 'completed').slice(0, 4).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{job.modelName}</div>
                    <div className="text-xs text-gray-500">Completed {job.completedAt}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-600">{job.finalAccuracy}%</div>
                  <div className="text-xs text-gray-500">Final Accuracy</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLTrainingProgress;
