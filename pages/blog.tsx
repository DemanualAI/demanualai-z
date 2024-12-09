import { getSortedPostsData } from '../lib/posts';
import Link from 'next/link';
import Image from 'next/image';
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

export default function Blog({ allPostsData }: { allPostsData: BlogPost[] }) {
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
    <section >
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

      <div className="container px-6 py-10 mx-auto relative">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800 lg:text-3xl">From the blog</h1>
          <p className="max-w-lg mx-auto mt-4 text-gray-500">
            Insights and updates from our team on AI automation and business transformation
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-8 md:mt-16 md:grid-cols-2 xl:grid-cols-3">
          {allPostsData.map(({ id, title, excerpt, date, author, role, image }) => (
            <div className="border-2 border-gray-300 rounded-lg p-2" key={id}>
              <div className="relative group">
                <Image 
                  className="object-cover object-center w-full h-64 rounded-lg lg:h-80 transition-all duration-300 grayscale group-hover:grayscale-0"
                  src={image}
                  alt={title}
                  width={500}
                  height={300}
                />
                <div className="absolute bottom-0 flex p-3 bg-white">
                  <div className="mx-4">
                    <h1 className="text-sm text-gray-700">{author}</h1>
                    <p className="text-sm text-gray-500">{role}</p>
                  </div>
                </div>
              </div>

              <h1 className="mt-6 text-xl font-semibold text-gray-800">
                {title}
              </h1>

              <hr className="w-32 my-6 text-blue-500" />

              <p className="text-sm text-gray-500">
                {excerpt}
              </p>

              <Link href={`/blog/${id}`} className="inline-block mt-4 text-blue-500 underline hover:text-blue-400">
                Read more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 