import React, { useRef, useState } from 'react';
import HealthIcon from './HealthIcon';
import './VideoPlayer.css';

export default function VideoPlayer({ title, src, onVideoEnd, className = '' }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * duration;
    }
  };

  return (
    <div className={`video-player ${className}`}>
      {title && (
        <div className="video-player-header">
          <h3>{title}</h3>
        </div>
      )}
      <div className="video-player-wrapper">
        <video
          ref={videoRef}
          src={src}
          className="video-player-video"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            setIsPlaying(false);
            if (onVideoEnd) onVideoEnd();
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls={false}
          playsInline
        />
        {!src && (
          <div className="video-player-placeholder">
            <HealthIcon type="video" size={64} />
            <p>请选择测试视频</p>
          </div>
        )}
      </div>
      {src && (
        <div className="video-player-controls">
          <button className="video-player-btn" onClick={handlePlay}>
            <HealthIcon type={isPlaying ? 'video' : 'video'} size={20} />
            {isPlaying ? '暂停' : '播放'}
          </button>
          <div className="video-player-progress" onClick={handleSeek}>
            <div className="video-player-progress-bar">
              <div 
                className="video-player-progress-fill" 
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
          </div>
          <div className="video-player-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      )}
    </div>
  );
}

