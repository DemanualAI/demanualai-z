import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head'

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
const GLOW_INTERVAL = 2000; // New glow every 2 seconds
const GLOW_DURATION = 3000; // Glow lasts 3 seconds
const MAX_ACTIVE_GLOWS = 3;
const GLOW_MOVE_SPEED = 0.05; // Controls how fast the glow moves to new position
const PATH_INTENSITY = 0.7; // Intensity of the path illumination
const LINE_COLOR = 'rgba(200, 200, 200, 0.2)';

const BLUE_GRADIENTS = [
  'rgba(127, 215, 252, 0.3)', // #7fd7fc
  'rgba(137, 103, 252, 0.3)', // #8967fc
  'rgba(92, 148, 250, 0.3)',  // #5c94fa
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
    <>
      <Head>
        <title>DemanualAI | Intelligent Business Process Automation & AI Solutions</title>
        <meta name="description" content="Transform your business with AI-powered automation. DemanualAI helps companies streamline operations, reduce costs, and boost efficiency through intelligent process automation." />
      </Head>
      <div className="relative min-h-screen">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full -z-20"
          style={{ 
            pointerEvents: 'none',
            backgroundColor: '#ffffff'
          }}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-16 pb-16">
          <div className="flex flex-col justify-between md:flex-row gap-[10px] md:gap-[30px] sm:gap-[20px]">
            {/* Left Column - 70% */}
            <div className="w-full md:w-[70%] self-start">
              <div className="w-full">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
                  Put Your Business on Autopilot & Reclaim Your Time + Resources
                </h1>
              </div>
            </div>

            {/* Right Column - 30% with overlap */}
            <div className="w-full md:w-[25%] md:ml-4 self-end lg:mt-16 md:mt-8 md:self-end">
              <div className="w-full">
                <p className="text-gray-700 text-right text-sm">
                  Focus on what you do best, and let us handle the rest. We&apos;ll put your business 
                  on autopilot by automating the repetitive tasks that slow you down. Book a free 
                  consultation today and discover how to free yourself from the busywork and invest 
                  our energy in growth and success
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Background Image */}
        <div className="h-[350px] -z-10">
          <Image 
            src="/images/bg.jpg" 
            alt="Background" 
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
            priority
          />
        </div>
        
        <br/>

        <div className="container mx-auto px-4 pt-16 pb-16">
          <div className="flex  justify-between flex-col lg:flex-row gap-[10px] md:gap-[30px] sm:gap-[20px]">  
            <div className="w-full self-start">
              {/* Statistics Section */}
              <div className="flex flex-col sm:flex-row gap-8 mt-8 w-full">
                {/* Stat 1 */}
                <div className="text-center flex-1">
                  <div className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7fd7fc] via-[#8967fc] to-[#5c94fa] animate-gradient-x">
                    500+
                  </div>
                  <div className="text-sm text-gray-600">
                    Processes<br/>Automated
                  </div>
                </div>

                {/* Divider 1 */}
                <div className="hidden sm:block w-px bg-gray-200 h-16 self-center"></div>

                {/* Stat 2 */}
                <div className="text-center flex-1">
                  <div className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7fd7fc] via-[#8967fc] to-[#5c94fa] animate-gradient-x">
                    50+
                  </div>
                  <div className="text-sm text-gray-600">
                    Projects Completed<br/>
                    <span className="text-xs">*as a team</span>
                  </div>
                </div>

                {/* Divider 2 */}
                <div className="hidden sm:block w-px bg-gray-200 h-16 self-center"></div>

                {/* Stat 3 */}
                <div className="text-center flex-1">
                  <div className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7fd7fc] via-[#8967fc] to-[#5c94fa] animate-gradient-x">
                    100%
                  </div>
                  <div className="text-sm text-gray-600">
                    On-Time<br/>Delivery
                  </div>
                </div>
              </div>

              {/* Button - Now full width and below stats */}
              <div className="w-full self-center mx-auto mt-8 md:text-center sm:text-center">
                <a href="https://calendly.com/demanual-team/scheduled-meeting" target="_blank" rel="noopener noreferrer" className="w-full text-white text-lg px-6 py-3 rounded-lg bg-black">
                  Let&apos;s Automate Your Business
                </a>
              </div>     
            </div>
            {/* Quote Section */}
            <div className="w-full md:text-center sm:text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
                  The more we automate, the more we need people who think critically and
                </h3>
            <div className="mt-12 border-2 border-black text-black p-6 rounded-lg">
                <p className="text-sm md:text-base">
                  Hello Demanual AI assists you in identifying and integrating cutting-edge AI solutions, guiding you seamlessly from inception to deployment and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>

        <br />
        <div className="bg-gray-80 py-16 ">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              {/* Left Column - Image */}
              <div className="w-full lg:w-1/2 h-full">
                <Image 
                  src="/images/bg.jpg" 
                  alt="Automation Benefits" 
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                  width={1920}
                  height={1080}
                  priority
                />
              </div>

              {/* Right Column - Benefits */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Transform Your Business Through Automation
                </h2>
                
                {/* Benefits List */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7fd7fc] via-[#8967fc] to-[#5c94fa]">
                      Operations
                    </h3>
                    <p className="text-gray-700">
                      Streamline workflows, reduce manual tasks, and minimize errors with intelligent automation solutions.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7fd7fc] via-[#8967fc] to-[#5c94fa]">
                      Sales
                    </h3>
                    <p className="text-gray-700">
                      Automate lead generation, follow-ups, and customer relationship management to boost conversion rates.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#7fd7fc] via-[#8967fc] to-[#5c94fa]">
                      Marketing
                    </h3>
                    <p className="text-gray-700">
                      Deploy automated campaigns, social media management, and data-driven marketing strategies.
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <Link href="/services" className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block">
                    View Our Services
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose DemanualAI?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 bg-white border-2 border-black rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Comprehensive Integration</h3>
                <p>Access to 1000+ tools and platforms for seamless workflow automation and business process integration.</p>
              </div>
              <div className="p-6 bg-white border-2 border-black rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Proven Results</h3>
                <p>Successfully automated 500+ processes and completed 50+ projects with 100% client satisfaction.</p>
              </div>
              <div className="p-6 bg-white border-2 border-black rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Expert Team</h3>
                <p>Dedicated AI specialists with deep expertise in LLMs, computer vision, and business process automation.</p>
              </div>
            </div>
          </div>
        </section>

        
      </div>
      
    </>
  );
} 