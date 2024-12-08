import React, { useEffect, useRef } from 'react';

interface Point {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    velocity: { x: number; y: number };
    color: string;
    targetColor: string;
    colorTransition: number;
  }
  
  interface GlowPoint {
    x: number;
    y: number;
    timeLeft: number;
    targetX: number;
    targetY: number;
    isMoving: boolean;
  }
  
  const GRID_SIZE = 50; // Size of grid cells
  const STIFFNESS = 0.03; // How quickly points return to position
  const DAMPING = 0.9; // Reduces oscillation
  const MAX_DISPLACEMENT = 5; // Maximum distance from base position
  const INTERACTION_RADIUS = 100;
  const COLOR_FADE_SPEED = 0.02;
  const GLOW_INTERVAL = 1000; // Reduced from 2000 to 1000 for more frequent changes
  const GLOW_DURATION = 3000; // Glow lasts 3 seconds
  const MAX_ACTIVE_GLOWS = 5; // Increased from 3 to 5 for more activity
  const GLOW_MOVE_SPEED = 0.05; // Controls how fast the glow moves to new position
  const PATH_INTENSITY = 0.9; // Increased from 0.7 to 0.9
  const LINE_COLOR = 'rgba(200, 200, 200, 0.2)';
  
  const BLUE_GRADIENTS = [
    'rgba(127, 215, 252, 0.5)', // Increased opacity from 0.3
    'rgba(137, 103, 252, 0.5)',
    'rgba(92, 148, 250, 0.5)',
  ];
  
  // Add a helper function to get cycling colors
  const getCyclingColor = (timestamp: number, index: number) => {
    const cycleSpeed = 3000; // Time for one complete cycle in ms
    const phase = (timestamp + index * 1000) % cycleSpeed; // Offset each glow point
    const position = phase / cycleSpeed;
    
    const colorIndex = Math.floor(position * BLUE_GRADIENTS.length);
    return BLUE_GRADIENTS[colorIndex];
  };
  
  export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<Point[][]>([]);
    const animationFrameRef = useRef<number>();
    const glowPointsRef = useRef<GlowPoint[]>([]);
    const lastGlowTimeRef = useRef(0);
    const mouseRef = useRef<{x: number, y: number}>({ x: 0, y: 0 });
  
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      const initializePoints = () => {
        const rows = Math.ceil(canvas.height / GRID_SIZE);
        const cols = Math.ceil(canvas.width / GRID_SIZE);
        const points: Point[][] = [];
  
        for (let i = 0; i <= rows; i++) {
          points[i] = [];
          for (let j = 0; j <= cols; j++) {
            points[i][j] = {
              x: j * GRID_SIZE,
              y: i * GRID_SIZE,
              baseX: j * GRID_SIZE,
              baseY: i * GRID_SIZE,
              velocity: { x: 0, y: 0 },
              color: 'rgba(200, 200, 200, 0.2)',
              targetColor: 'rgba(200, 200, 200, 0.2)',
              colorTransition: 0
            };
          }
        }
        pointsRef.current = points;
      };
  
      const updateCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initializePoints();
      };
  
      const createNewGlow = (timestamp: number) => {
        if (timestamp - lastGlowTimeRef.current > GLOW_INTERVAL) {
          glowPointsRef.current = glowPointsRef.current.filter(glow => glow.timeLeft > 0);
  
          if (glowPointsRef.current.length < MAX_ACTIVE_GLOWS) {
            // For existing glows, give them new target positions
            glowPointsRef.current.forEach(glow => {
              if (!glow.isMoving) {
                glow.targetX = Math.random() * (canvasRef.current?.width || 0);
                glow.targetY = Math.random() * (canvasRef.current?.height || 0);
                glow.isMoving = true;
              }
            });
  
            // Add new glow if needed
            if (glowPointsRef.current.length === 0) {
              glowPointsRef.current.push({
                x: Math.random() * (canvasRef.current?.width || 0),
                y: Math.random() * (canvasRef.current?.height || 0),
                targetX: Math.random() * (canvasRef.current?.width || 0),
                targetY: Math.random() * (canvasRef.current?.height || 0),
                timeLeft: GLOW_DURATION,
                isMoving: true
              });
            }
            lastGlowTimeRef.current = timestamp;
          }
        }
      };
  
      const updateGlowPositions = () => {
        glowPointsRef.current.forEach(glow => {
          if (glow.isMoving) {
            // Calculate direction to target
            const dx = glow.targetX - glow.x;
            const dy = glow.targetY - glow.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
  
            if (distance > 1) {
              // Ease towards target position
              glow.x += dx * GLOW_MOVE_SPEED;
              glow.y += dy * GLOW_MOVE_SPEED;
            } else {
              glow.isMoving = false;
            }
          }
        });
      };
  
      const updatePoints = (timestamp: number) => {
        pointsRef.current.forEach(row => {
          row.forEach(point => {
            // Physics updates
            point.velocity.x += (Math.random() - 0.5) * 0.3;
            point.velocity.y += (Math.random() - 0.5) * 0.3;
  
            const springDx = point.baseX - point.x;
            const springDy = point.baseY - point.y;
            point.velocity.x += springDx * STIFFNESS;
            point.velocity.y += springDy * STIFFNESS;
  
            point.velocity.x *= DAMPING;
            point.velocity.y *= DAMPING;
  
            point.x += point.velocity.x;
            point.y += point.velocity.y;
  
            // Limit displacement
            const displacement = Math.sqrt(
              Math.pow(point.x - point.baseX, 2) + 
              Math.pow(point.y - point.baseY, 2)
            );
            if (displacement > MAX_DISPLACEMENT) {
              const angle = Math.atan2(point.y - point.baseY, point.x - point.baseX);
              point.x = point.baseX + Math.cos(angle) * MAX_DISPLACEMENT;
              point.y = point.baseY + Math.sin(angle) * MAX_DISPLACEMENT;
            }
  
            // Reset color
            point.targetColor = 'rgba(200, 200, 200, 0.2)';
            let maxIntensity = 0;
  
            glowPointsRef.current.forEach((glow, index) => {
              // Check distance to current glow position
              const dx = glow.x - point.x;
              const dy = glow.y - point.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
  
              // Check distance to path
              let pathIntensity = 0;
              if (glow.isMoving) {
                const pathDistance = distanceToLine(
                  point.x, point.y,
                  glow.x, glow.y,
                  glow.targetX, glow.targetY
                );
                pathIntensity = Math.max(0, 1 - (pathDistance / INTERACTION_RADIUS)) * PATH_INTENSITY;
              }
  
              // Use the stronger of the two intensities
              const glowIntensity = Math.max(
                1 - (distance / INTERACTION_RADIUS),
                pathIntensity
              );
  
              if (glowIntensity > maxIntensity) {
                maxIntensity = glowIntensity;
                const glowColor = getCyclingColor(timestamp, index);
                point.targetColor = glowColor;
                point.colorTransition = maxIntensity * (glow.timeLeft / GLOW_DURATION);
              }
            });
  
            point.color = point.targetColor;
          });
        });
  
        // Update glow points
        glowPointsRef.current.forEach(glow => {
          glow.timeLeft -= 16;
        });
      };
  
      // Helper function to calculate distance from point to line segment
      const distanceToLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
  
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
  
        if (lenSq !== 0) param = dot / lenSq;
  
        let xx, yy;
  
        if (param < 0) {
          xx = x1;
          yy = y1;
        } else if (param > 1) {
          xx = x2;
          yy = y2;
        } else {
          xx = x1 + param * C;
          yy = y1 + param * D;
        }
  
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
      };
  
      const drawGrid = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        // Draw horizontal lines
        pointsRef.current.forEach(row => {
          for (let i = 0; i < row.length - 1; i++) {
            ctx.beginPath();
            ctx.strokeStyle = row[i].color;
            ctx.moveTo(row[i].x, row[i].y);
            ctx.lineTo(row[i + 1].x, row[i + 1].y);
            ctx.stroke();
          }
        });
  
        // Draw vertical lines
        for (let i = 0; i < pointsRef.current[0].length; i++) {
          for (let j = 0; j < pointsRef.current.length - 1; j++) {
            ctx.beginPath();
            ctx.strokeStyle = pointsRef.current[j][i].color;
            ctx.moveTo(pointsRef.current[j][i].x, pointsRef.current[j][i].y);
            ctx.lineTo(pointsRef.current[j + 1][i].x, pointsRef.current[j + 1][i].y);
            ctx.stroke();
          }
        }
      };
  
      const animate = (timestamp: number) => {
        createNewGlow(timestamp);
        updateGlowPositions();
        updatePoints(timestamp);
        drawGrid();
        animationFrameRef.current = requestAnimationFrame(animate);
      };
  
      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
      };
  
      window.addEventListener('resize', updateCanvasSize);
      updateCanvasSize();
      animate(0);
      canvas.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        window.removeEventListener('resize', updateCanvasSize);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        canvas.removeEventListener('mousemove', handleMouseMove);
      };
    }, []);

  return (
    <div className="relative min-h-screen">
      {/* Grid Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full -z-20"
        style={{ 
          pointerEvents: 'none',
          backgroundColor: '#ffffff'
        }}
      />
      {/* Hero Image */}
      <div className="h-[150px] w-full -z-10">
        <img 
          src="/images/bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* About Us Section */}
      <div className="container w-[60%] mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12">About Us</h1>
        <div>
          
            <p className="text-gray-700 text-lg mb-6">
              At DemanualAI, we are a dynamic team of AI specialists with a deep focus on large 
              language models (LLMs) and computer vision. We collaborate closely with industries and 
              businesses to transform their operations by building cutting-edge internal tools, fully 
              functional websites, and sophisticated AI-powered web applications.              From automating complex workflows to creating interactive AI-driven customer experiences, 
              we harness the power of machine learning to deliver innovative solutions tailored to the 
              unique needs of each client. Our expertise enables businesses to unlock new efficiencies 
              and possibilities through automation and intelligent design.
            </p>
       
        </div>
      </div>

      {/* Careers Section */}
      <div id="careers" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Column - Content */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join Our Mission to Democratize AI
              </h2>
              <p className="text-gray-700 text-lg mb-6">
                We're on a mission to make AI accessible, ethical, and truly beneficial for everyone. 
                Our diverse team brings together different perspectives, experiences, and skills to 
                create AI solutions that work for all communities.
              </p>
              <p className="text-gray-700 text-lg mb-8">
                If you're passionate about transforming how businesses operate and making AI 
                technology more inclusive and impactful, we want to hear from you.
              </p>
              <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Join Our Team
              </button>
            </div>

            {/* Right Column - Image */}
            <div className="w-full lg:w-1/2 h-[400px]">
              <img 
                src="/images/bg.jpg" 
                alt="Careers" 
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 