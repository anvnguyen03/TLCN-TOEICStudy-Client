import React, { useContext } from 'react';
import ReactPlayer from 'react-player';
import { CourseContext } from '../../context/CourseContext';

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const context = useContext(CourseContext);
  if (!context) return null;

  const { setVideoTime } = context;

  return (
    <div className="p-mb-4">
      <ReactPlayer
        url={url}
        controls
        width="100%"
        onProgress={(state) => setVideoTime(state.playedSeconds)}
      />
    </div>
  );
};

export default VideoPlayer;