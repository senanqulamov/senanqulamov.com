export type GalleryCategory = "life" | "work" | "events" | "baku";

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
  place?: string;
  year?: number;
  category: GalleryCategory;
  width: number;
  height: number;
  placeholder?: boolean;
  credit?: string;
  source?: string;
};

const generated = [
  ["Night skyline with lit windows and distant bokeh", "City lights after rain", "Baku", "baku"],
  ["Dusk sky above a calm sea horizon", "Evening over the Caspian", "Absheron", "baku"],
  ["Layered mountain ridges in blue haze", "Road into the haze", "Quba", "life"],
  ["Wet city street with blurred light streaks", "A little later than planned", "Baku", "work"],
  ["Warm interior window light at night", "Windows still on", "Baku", "life"],
  ["Soft abstract bokeh in violet and amber", "Out of focus, in frame", "Baku", "life"],
  ["Foggy park trees at dawn", "Before the city wakes", "Sheki", "life"],
  ["Geometric architecture in long shadows", "Lines with somewhere to go", "Baku", "baku"],
  ["Dark desk with a laptop screen glow", "Late build, quiet office", "Baku", "work"],
  ["Stage spotlights over a crowd silhouette", "The room was listening", "Baku", "events"],
  ["Night skyline reflected in dark glass", "Blue hour, higher up", "Baku", "baku"],
  ["Golden sea horizon at sunset", "Caspian afterglow", "Absheron", "life"],
  ["Misty mountain valley in layers", "The longer way home", "Gabala", "life"],
  ["Night road crossing through city lights", "One more turn", "Baku", "work"],
  ["Warm-lit room with a window at dusk", "Soft light, hard problem", "Baku", "work"],
  ["Teal and amber bokeh lights", "Small constellations", "Baku", "life"],
  ["Fog rolling between tall park trees", "A quieter morning", "Sheki", "life"],
  ["Concrete facade with sharp diagonal shade", "Built for the light", "Baku", "baku"],
  ["Laptop silhouette on a dark desk", "After everyone left", "Baku", "work"],
  ["Concert lights above a dark audience", "A full room", "Baku", "events"],
  ["Tall buildings against a violet night sky", "North of midnight", "Baku", "baku"],
  ["Sea at dusk beneath a glowing cloud", "Salt air at sundown", "Absheron", "life"],
  ["Blue mountains fading into distance", "Above the low clouds", "Quba", "life"],
  ["City street with amber traffic trails", "The way back from work", "Baku", "work"],
  ["Interior glowing gold behind dark walls", "The last open window", "Baku", "life"],
  ["Close-up lights softened into colored circles", "Light finds a way", "Baku", "life"],
  ["Trees appearing through cool morning fog", "Half-seen path", "Gabala", "life"],
  ["Modern facade patterned with shadow", "A study in angles", "Baku", "baku"],
  ["Monitor glow above a quiet desk", "Shipping after sunset", "Baku", "work"],
  ["Spotlight beams over an event crowd", "When the doors opened", "Baku", "events"],
  ["Baku skyline with warm windows at night", "The city stays awake", "Baku", "baku"],
  ["Caspian water under a rose dusk sky", "Tide and timing", "Absheron", "life"],
  ["Mountain silhouettes in pale haze", "Further out", "Gabala", "life"],
  ["Rainy boulevard with colorful light trails", "Wet pavement, bright ideas", "Baku", "work"],
  ["Warm apartment light against blue evening", "Home between meetings", "Baku", "life"],
  ["Amber bokeh over a dark blue field", "A soft interruption", "Baku", "life"],
  ["Forest trees obscured by silver fog", "Held by the weather", "Sheki", "life"],
  ["Sunlit architectural planes and deep shade", "Edges of afternoon", "Baku", "baku"],
  ["Laptop and desk in blue monitor light", "The build is still running", "Baku", "work"],
  ["Light beams cutting through a crowd", "Every seat taken", "Baku", "events"],
  ["Skyline lights across a midnight waterfront", "Across the bay", "Baku", "baku"],
  ["Sunset fading over a quiet sea", "A horizon worth keeping", "Absheron", "life"],
  ["Distant mountain slopes in evening mist", "High ground", "Quba", "life"],
  ["Street lights streaming along a night road", "Moving through Baku", "Baku", "work"],
  ["Interior window casting warm light", "A calm corner", "Baku", "life"],
  ["Violet and teal lens bokeh", "The blur before clarity", "Baku", "life"],
  ["Misty park canopy in blue dawn light", "Rain in the trees", "Gabala", "life"],
  ["Geometric building shadow at golden hour", "The sun made the pattern", "Baku", "baku"],
  ["Workspace lit by a single screen", "A good kind of late", "Baku", "work"],
  ["Stage lights floating over audience silhouettes", "After the applause", "Baku", "events"],
] as const;

/** Replace a generated item by dropping a real photo into public/images/gallery/, then update src, alt, caption, width and height, and remove placeholder. */
export const galleryPhotos: GalleryPhoto[] = [
  {
    src: "/images/portrait.webp",
    alt: "Senan Qulamov leaning against a wooden wall at night in Baku",
    caption: "Between the builds",
    place: "Baku",
    year: 2025,
    category: "life",
    width: 1200,
    height: 1600,
  },
  ...generated.map(([alt, caption, place, category], index) => {
    const photo = credits[index];
    return {
      src: `/images/gallery/placeholders/${String(index + 1).padStart(2, "0")}.webp`,
      alt,
      caption,
      place,
      year: 2019 + (index % 8),
      category,
      width: photo.width,
      height: photo.height,
      placeholder: true,
      credit: photo.author,
      source: photo.source,
    };
  }),
];
import credits from "./gallery-photo-credits.json";
