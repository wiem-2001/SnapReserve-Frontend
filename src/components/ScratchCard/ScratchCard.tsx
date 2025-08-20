import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import scratchOverlay from '../../assets/scratchcard.png';
import scratchRevealed from '../../assets/scratchRevealed.png';
import scratchSound from '../../assets/scratch.mp3'; 

const ScratchCard = (
  {
  onDismiss,
  onScratchComplete,
}: {
  onDismiss: () => void;
  onScratchComplete?: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const overlayImage = useRef(new Image());
  const [isScratching, setIsScratching] = useState(false);
  const [isScratched, setIsScratched] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    overlayImage.current.src = scratchOverlay;
    overlayImage.current.onload = drawInitialCanvas;
    overlayImage.current.onerror = () =>
      console.error('Failed to load overlay image');
    return () => {
      overlayImage.current.onload = null;
    };
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(scratchSound);
    audioRef.current.loop = true;

    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const drawInitialCanvas = () => {
    if (!canvasRef.current || !overlayImage.current.complete) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    setCtx(context);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = 'source-over';
    context.drawImage(
      overlayImage.current,
      0,
      0,
      overlayImage.current.width,
      overlayImage.current.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  const handleMouseDown = () => {
    setIsScratching(true);
    if (audioRef.current && !isScratched) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.warn('Audio play failed:', err));
    }
  };

  const handleMouseUp = () => {
    if (!isScratching || !ctx || !canvasRef.current) return;
    setIsScratching(false);
    audioRef.current?.pause();

    const imageData = ctx.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const totalPixels = pixels.length / 4;
    const scratchRatio = transparentPixels / totalPixels;

    if (scratchRatio > 0.9 && !isScratched) {
      setIsScratched(true);
      onScratchComplete?.();
      setTimeout(onDismiss, 1000);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isScratching || !ctx || !canvasRef.current || isScratched) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '55%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1001,
        width: '400px',
        height: '550px',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <h1
        style={{
          color: 'black',
          marginBottom: '20px',
          fontSize: '23px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '0 16px',
        }}
      >
        Thanks for joining us! <br />
        Scratch to reveal your welcome gift!
      </h1>

      <img
        src={scratchRevealed}
        alt="Revealed"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 3,
          left: 0,
          zIndex: 0,
          marginTop: '30px',
        }}
      />

      <canvas
        ref={canvasRef}
        width={400}
        height={550}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '100%',
          cursor: isScratched ? 'default' : 'pointer',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          marginTop: '30px',
        }}
      />
    </div>
  );
};

export default ScratchCard;
