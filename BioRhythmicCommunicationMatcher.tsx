import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Clock, Moon, Sun, Heart, Brain, Zap, Waves } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface BioRhythm {
  physical: number;
  emotional: number;
  intellectual: number;
  circadian: number;
  heartRate: number;
  stressLevel: number;
}

interface CommunicationProfile {
  preferredTone: string;
  optimalTiming: string;
  energyLevel: number;
  focusCapacity: number;
  socialReadiness: number;
  recommendations: string[];
}

interface BioMatcherProps {
  isActive: boolean;
  onProfileGenerated: (profile: CommunicationProfile) => void;
}

export function BioRhythmicCommunicationMatcher({ isActive, onProfileGenerated }: BioMatcherProps) {
  const [bioRhythms, setBioRhythms] = useState<BioRhythm>({
    physical: 0,
    emotional: 0,
    intellectual: 0,
    circadian: 0,
    heartRate: 0,
    stressLevel: 0
  });

  const [analysisStage, setAnalysisStage] = useState('idle');
  const [currentProfile, setCurrentProfile] = useState<CommunicationProfile | null>(null);
  const [bioWaveformData, setBioWaveformData] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      startBioRhythmAnalysis();
    }
  }, [isActive]);

  useEffect(() => {
    // Generate dynamic bio-waveform data
    const interval = setInterval(() => {
      if (analysisStage === 'analyzing') {
        setBioWaveformData(prev => {
          const newData = [...prev.slice(-49)]; // Keep last 49 points
          const time = Date.now() * 0.01;
          const newPoint = 
            Math.sin(time * 0.02) * 30 +
            Math.sin(time * 0.05) * 20 +
            Math.sin(time * 0.1) * 10 +
            50; // Baseline at 50
          newData.push(newPoint);
          return newData;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [analysisStage]);

  const startBioRhythmAnalysis = async () => {
    setAnalysisStage('initializing');
    await new Promise(resolve => setTimeout(resolve, 1000));

    setAnalysisStage('scanning');
    
    // Simulate bio-sensor readings
    const scanBioMetrics = async () => {
      for (let i = 0; i <= 100; i += 2) {
        setBioRhythms(prev => ({
          physical: Math.min(i, 70 + Math.random() * 30),
          emotional: Math.min(i, 60 + Math.random() * 40),
          intellectual: Math.min(i, 80 + Math.random() * 20),
          circadian: Math.min(i, calculateCircadianRhythm()),
          heartRate: 60 + Math.random() * 40,
          stressLevel: Math.random() * 100
        }));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    };

    await scanBioMetrics();
    setAnalysisStage('analyzing');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate communication profile
    const profile = generateCommunicationProfile(bioRhythms);
    setCurrentProfile(profile);
    setAnalysisStage('complete');
    onProfileGenerated(profile);

    // Auto-reset after 5 seconds
    setTimeout(() => {
      setAnalysisStage('idle');
      setCurrentProfile(null);
      setBioWaveformData([]);
    }, 5000);
  };

  const calculateCircadianRhythm = (): number => {
    const hour = new Date().getHours();
    // Peak alertness typically around 10 AM and 6 PM
    const morningPeak = Math.max(0, 100 - Math.abs(hour - 10) * 8);
    const eveningPeak = Math.max(0, 80 - Math.abs(hour - 18) * 6);
    return Math.max(morningPeak, eveningPeak);
  };

  const generateCommunicationProfile = (bio: BioRhythm): CommunicationProfile => {
    const hour = new Date().getHours();
    let preferredTone = 'balanced';
    let optimalTiming = 'now';
    let energyLevel = (bio.physical + bio.circadian) / 2;
    let focusCapacity = bio.intellectual;
    let socialReadiness = bio.emotional;

    // Determine preferred communication tone
    if (bio.stressLevel > 70) {
      preferredTone = 'gentle and reassuring';
    } else if (bio.physical > 80 && bio.emotional > 70) {
      preferredTone = 'energetic and enthusiastic';
    } else if (bio.intellectual > 85) {
      preferredTone = 'detailed and analytical';
    } else if (hour < 9 || hour > 21) {
      preferredTone = 'calm and soothing';
    }

    // Determine optimal timing
    if (bio.circadian > 80) {
      optimalTiming = 'optimal - high alertness detected';
    } else if (bio.circadian < 40) {
      optimalTiming = 'suboptimal - consider rescheduling';
    } else {
      optimalTiming = 'moderate - proceed with awareness';
    }

    // Generate personalized recommendations
    const recommendations = generateRecommendations(bio, hour);

    return {
      preferredTone,
      optimalTiming,
      energyLevel,
      focusCapacity,
      socialReadiness,
      recommendations
    };
  };

  const generateRecommendations = (bio: BioRhythm, hour: number): string[] => {
    const recs = [];

    if (bio.stressLevel > 60) {
      recs.push('🧘 Start with calming breathing exercises');
      recs.push('💙 Use supportive and patient language');
    }

    if (bio.intellectual > 80) {
      recs.push('🧠 Engage with complex topics and details');
      recs.push('📊 Provide comprehensive information');
    }

    if (bio.physical < 50) {
      recs.push('⚡ Keep interactions brief and focused');
      recs.push('🎯 Prioritize essential communication only');
    }

    if (bio.emotional > 75) {
      recs.push('💝 Emphasize emotional connection and empathy');
      recs.push('🤝 Focus on collaborative approaches');
    }

    if (hour < 9) {
      recs.push('🌅 Use gentle morning greetings');
      recs.push('☕ Allow time for mental activation');
    } else if (hour > 20) {
      recs.push('🌙 Keep conversations calm and brief');
      recs.push('😴 Avoid overly stimulating content');
    }

    if (bio.circadian > 85) {
      recs.push('🚀 Perfect time for important discussions');
      recs.push('⭐ Utilize peak cognitive performance');
    }

    return recs.slice(0, 4); // Return top 4 recommendations
  };

  const renderBioWaveform = () => {
    if (bioWaveformData.length < 2) return null;

    const width = 280;
    const height = 60;
    const points = bioWaveformData.map((value, index) => {
      const x = (index / (bioWaveformData.length - 1)) * width;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="w-full h-16">
        <polyline
          points={points}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <Card className="w-[520px] bg-gradient-to-br from-green-900/90 to-blue-900/90 text-white border-green-500/50 shadow-2xl">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
            >
              <Activity className="w-8 h-8" />
            </motion.div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-300 to-blue-300 bg-clip-text text-transparent">
              Bio-Rhythmic Communication Matcher
            </h3>
            <p className="text-sm text-green-200">
              Analyzing biological patterns for optimal communication
            </p>
          </div>

          {analysisStage !== 'idle' && (
            <div className="space-y-4 mb-6">
              {/* Bio-Metrics Dashboard */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-sm">Physical</span>
                    </div>
                    <span className="text-xs text-green-300">{bioRhythms.physical.toFixed(0)}%</span>
                  </div>
                  <Progress value={bioRhythms.physical} className="h-2" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">Intellectual</span>
                    </div>
                    <span className="text-xs text-green-300">{bioRhythms.intellectual.toFixed(0)}%</span>
                  </div>
                  <Progress value={bioRhythms.intellectual} className="h-2" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                      <span className="text-sm">Heart Rate</span>
                    </div>
                    <span className="text-xs text-green-300">{bioRhythms.heartRate.toFixed(0)} BPM</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Waves className="w-4 h-4 text-blue-400" />
                      <span className="text-sm">Emotional</span>
                    </div>
                    <span className="text-xs text-green-300">{bioRhythms.emotional.toFixed(0)}%</span>
                  </div>
                  <Progress value={bioRhythms.emotional} className="h-2" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {new Date().getHours() < 18 ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                      <span className="text-sm">Circadian</span>
                    </div>
                    <span className="text-xs text-green-300">{bioRhythms.circadian.toFixed(0)}%</span>
                  </div>
                  <Progress value={bioRhythms.circadian} className="h-2" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-orange-400" />
                      <span className="text-sm">Stress Level</span>
                    </div>
                    <span className="text-xs text-orange-300">{bioRhythms.stressLevel.toFixed(0)}%</span>
                  </div>
                  <Progress value={bioRhythms.stressLevel} className="h-2" />
                </div>
              </div>

              {/* Bio-waveform Visualization */}
              {analysisStage === 'analyzing' && (
                <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-green-300">Live Bio-Signal</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-green-300">Recording</span>
                    </div>
                  </div>
                  {renderBioWaveform()}
                </div>
              )}
            </div>
          )}

          {/* Communication Profile Results */}
          {currentProfile && analysisStage === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Optimal Communication Profile</span>
                </h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-xs text-blue-300">Preferred Tone:</span>
                    <p className="text-sm text-white capitalize">{currentProfile.preferredTone}</p>
                  </div>
                  <div>
                    <span className="text-xs text-blue-300">Timing Assessment:</span>
                    <p className="text-sm text-white">{currentProfile.optimalTiming}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-medium text-green-400">{currentProfile.energyLevel.toFixed(0)}%</div>
                    <div className="text-xs text-green-300">Energy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-blue-400">{currentProfile.focusCapacity.toFixed(0)}%</div>
                    <div className="text-xs text-blue-300">Focus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium text-purple-400">{currentProfile.socialReadiness.toFixed(0)}%</div>
                    <div className="text-xs text-purple-300">Social</div>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-blue-300 mb-2 block">Personalized Recommendations:</span>
                  <div className="space-y-1">
                    {currentProfile.recommendations.map((rec, index) => (
                      <Badge key={index} variant="outline" className="text-xs mr-2 mb-1 border-blue-400/50 text-blue-200">
                        {rec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Status Indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-2 text-xs text-green-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Bio-rhythmic analysis {analysisStage}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
