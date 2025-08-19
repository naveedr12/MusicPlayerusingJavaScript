import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  List
} from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  src: string;
  cover: string;
}

const sampleTracks: Track[] = [
  {
    id: 1,
    title: "Ambient Dreams",
    artist: "Sound Waves",
    duration: 240,
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 2,
    title: "Digital Horizon",
    artist: "Tech Melody",
    duration: 195,
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "https://images.pexels.com/photos/1666779/pexels-photo-1666779.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 3,
    title: "Ocean Waves",
    artist: "Nature Sounds",
    duration: 320,
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    id: 4,
    title: "City Lights",
    artist: "Urban Beats",
    duration: 210,
    src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    cover: "https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg?auto=compress&cs=tinysrgb&w=300"
  }
];

function App() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeated, setIsRepeated] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const currentTrack = sampleTracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (isRepeated) {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeated, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    let nextIndex;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * sampleTracks.length);
    } else {
      nextIndex = (currentTrackIndex + 1) % sampleTracks.length;
    }
    setCurrentTrackIndex(nextIndex);
    setCurrentTime(0);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? sampleTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setCurrentTime(0);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * currentTrack.duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setShowPlaylist(false);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-purple-600 to-cyan-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-spin" style={{animationDuration: '20s'}}></div>
      </div>
      
      <div className="w-full max-w-md mx-auto">
        {/* Main Player Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-2 border-cyan-400/50 relative overflow-hidden">
          {/* Neon Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl"></div>
          <div className="relative z-10">
          {/* Album Cover */}
          <div className="relative mb-8">
            <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-gradient-to-r from-yellow-400 to-pink-500 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 p-1 rounded-2xl">
                <div className="w-full h-full rounded-xl overflow-hidden">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
                </div>
              </div>
            </div>
            <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${isPlaying ? 'bg-gradient-to-r from-pink-500/30 to-cyan-500/30 animate-pulse shadow-lg shadow-pink-500/50' : 'bg-black/10'}`}></div>
            {/* Vinyl Record Effect */}
            <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black rounded-full border-4 border-yellow-400 ${isPlaying ? 'animate-spin' : ''}`} style={{animationDuration: '3s'}}>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full"></div>
            </div>
          </div>

          {/* Track Info */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent mb-2 drop-shadow-lg">{currentTrack.title}</h2>
            <p className="text-cyan-300 text-lg font-semibold drop-shadow-md">{currentTrack.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div 
              ref={progressRef}
              className="relative h-3 bg-black/40 rounded-full cursor-pointer group border border-cyan-400/30"
              onClick={handleSeek}
            >
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 rounded-full transition-all duration-150 shadow-lg shadow-pink-500/50"
                style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
              ></div>
              <div 
                className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full shadow-lg shadow-pink-500/50 opacity-0 group-hover:opacity-100 transition-all duration-200 border-2 border-white"
                style={{ left: `calc(${(currentTime / currentTrack.duration) * 100}% - 8px)` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-cyan-300 mt-2 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`p-2 rounded-full transition-all duration-200 ${
                isShuffled 
                  ? 'text-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/50 border border-yellow-400/50' 
                  : 'text-cyan-300 hover:text-yellow-400 hover:bg-yellow-400/10 hover:shadow-lg hover:shadow-yellow-400/30'
              }`}
            >
              <Shuffle size={20} />
            </button>
            
            <button
              onClick={handlePrevious}
              className="p-3 rounded-full text-cyan-300 hover:text-pink-400 hover:bg-pink-400/20 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-pink-400/50"
            >
              <SkipBack size={24} />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-4 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 text-black hover:from-yellow-500 hover:via-pink-600 hover:to-cyan-500 transition-all duration-200 hover:scale-110 shadow-2xl shadow-pink-500/50 border-2 border-white/20 font-bold"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
            
            <button
              onClick={handleNext}
              className="p-3 rounded-full text-cyan-300 hover:text-pink-400 hover:bg-pink-400/20 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-pink-400/50"
            >
              <SkipForward size={24} />
            </button>
            
            <button
              onClick={() => setIsRepeated(!isRepeated)}
              className={`p-2 rounded-full transition-all duration-200 ${
                isRepeated 
                  ? 'text-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/50 border border-yellow-400/50' 
                  : 'text-cyan-300 hover:text-yellow-400 hover:bg-yellow-400/10 hover:shadow-lg hover:shadow-yellow-400/30'
              }`}
            >
              <Repeat size={20} />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-cyan-300 hover:text-pink-400 transition-colors duration-200 hover:drop-shadow-lg"
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (newVolume > 0) setIsMuted(false);
                }}
                className="w-full h-3 bg-black/40 rounded-lg appearance-none cursor-pointer slider border border-cyan-400/30"
              />
            </div>
          </div>

          {/* Playlist Toggle */}
          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl text-cyan-300 hover:text-pink-400 hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-cyan-500/10 transition-all duration-200 border border-cyan-400/30 hover:border-pink-400/50 hover:shadow-lg hover:shadow-pink-400/30"
          >
            <List size={20} />
            <span>Playlist</span>
          </button>
          </div>
        </div>

        {/* Playlist */}
        {showPlaylist && (
          <div className="mt-4 bg-black/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border-2 border-cyan-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl"></div>
            <div className="relative z-10">
            <h3 className="text-cyan-300 font-bold mb-4 flex items-center space-x-2 text-lg">
              <Music size={20} />
              <span>Now Playing</span>
            </h3>
            <div className="space-y-2">
              {sampleTracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(index)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    index === currentTrackIndex
                      ? 'bg-gradient-to-r from-yellow-400/20 via-pink-500/20 to-cyan-500/20 border-2 border-pink-500/50 shadow-lg shadow-pink-500/30'
                      : 'hover:bg-gradient-to-r hover:from-pink-500/10 hover:to-cyan-500/10 hover:border hover:border-cyan-400/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={track.cover} 
                      alt={track.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        index === currentTrackIndex ? 'text-yellow-400 font-bold' : 'text-cyan-300'
                      }`}>
                        {track.title}
                      </p>
                      <p className={`text-sm truncate ${
                        index === currentTrackIndex ? 'text-pink-300' : 'text-cyan-400/70'
                      }`}>{track.artist}</p>
                    </div>
                    <span className="text-cyan-300 text-sm font-mono">{formatTime(track.duration)}</span>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        )}

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack.src}
          preload="metadata"
        />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #fbbf24, #ec4899, #06b6d4);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.5);
          border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #fbbf24, #ec4899, #06b6d4);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.5);
        }
      `}</style>
    </div>
  );
}

export default App;