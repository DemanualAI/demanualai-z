import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { getSortedPostsData } from '../lib/posts';
import { BlogPost } from '../types/blog';
import { useEffect, useRef, useState } from 'react';
import { Alata } from 'next/font/google';
import toast from 'react-hot-toast';


export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

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

const alata = Alata({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Custom404() {
    const router = useRouter();

    const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[][]>([]);
  const animationFrameRef = useRef<number>();
  const glowPointsRef = useRef<GlowPoint[]>([]);
  const lastGlowTimeRef = useRef(0);
  const mouseRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('loading');

      try {
          const response = await fetch('/api/submit-form', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  name: `${firstName} ${lastName}`,
                  email,
                  message,
              }),
          });

          if (!response.ok) throw new Error('Failed to submit');
          
          setStatus('success');
          setFirstName('');
          setLastName('');
          setEmail('');
          setMessage('');
          
          // Updated success toast with font
          toast.success('Message sent successfully!', {
              duration: 5000,
              position: 'top-right',
              style: {
                  background: '#10B981',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '10px',
                  fontFamily: alata.style.fontFamily,
              },
              icon: '✉️',
          });
      } catch (error) {
          setStatus('error');
          // Updated error toast with font
          toast.error('Failed to send message. Please try again.', {
              duration: 5000,
              position: 'top-right',
              style: {
                  background: '#EF4444',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '10px',
                  fontFamily: alata.style.fontFamily,
              },
          });
      }
  };

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
        <section>

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
                <Image 
                    src="/images/bg.jpg"
                    alt="Background"
                    width={1920}
                    height={1080}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="container flex items-center justify-center min-h-screen px-6 py-4 mx-auto">
                <div className="w-full">
                    <div className="flex flex-col items-center max-w-lg mx-auto text-center">
                        <p className="text-sm font-medium text-blue-500">404 error</p>
                        <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">We lost this page</h1>
                        <p className="mt-4 text-gray-500">We searched high and low, but couldn't find what you're looking for. Let's find a better place for you to go.</p>

                        <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
                            <button 
                                onClick={() => router.back()}
                                className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                                </svg>
                                <span>Go back</span>
                            </button>

                            <Link 
                                href="/"
                                className="w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200 bg-blue-500 rounded-lg shrink-0 sm:w-auto hover:bg-blue-600"
                            >
                                Take me home
                            </Link>
                        </div>
                    </div>

                    <div className="grid w-full max-w-6xl grid-cols-1 gap-8 mx-auto mt-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="p-6 rounded-lg bg-blue-50">
                            <span className="text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </span>
                            
                            <h3 className="mt-6 font-medium text-gray-700">Services</h3>
                            <p className="mt-2 text-gray-500">Learn about our automation services.</p>
                            <Link href="/services" className="inline-flex items-center mt-4 text-sm text-blue-500 gap-x-2 hover:underline">
                                <span>View services</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>
                        </div>

                        <div className="p-6 rounded-lg bg-blue-50">
                            <span className="text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                </svg>
                            </span>
                            
                            <h3 className="mt-6 font-medium text-gray-700">Our blog</h3>
                            <p className="mt-2 text-gray-500">Read the latest posts on our blog.</p>
                            <Link href="/blog" className="inline-flex items-center mt-4 text-sm text-blue-500 gap-x-2 hover:underline">
                                <span>View latest posts</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>
                        </div>

                        <div className="p-6 rounded-lg bg-blue-50">
                            <span className="text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                </svg>
                            </span>
                            
                            <h3 className="mt-6 font-medium text-gray-700">Contact us</h3>
                            <p className="mt-2 text-gray-500">Get in touch with our team.</p>
                            <Link href="/contact" className="inline-flex items-center mt-4 text-sm text-blue-500 gap-x-2 hover:underline">
                                <span>Contact our team</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 