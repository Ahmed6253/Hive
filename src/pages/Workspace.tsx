import {
  Aperture,
  Apple,
  Atom,
  Backpack,
  Bike,
  BookOpenText,
  Brain,
  Briefcase,
  Brush,
  Camera,
  Car,
  Cat,
  CircleDollarSign,
  ClipboardPenLine,
  Code,
  Dog,
  Drill,
  Drum,
  Dumbbell,
  FlaskConical,
  GraduationCap,
  Guitar,
  Hammer,
  Keyboard,
  Medal,
  Mic,
  Monitor,
  Music,
  NotebookPen,
  Piano,
  Plus,
  Shirt,
  Stethoscope,
  Store,
  Tablets,
  WandSparkles,
  Wrench,
} from "lucide-react";

const Workspace = () => {
  const Icons = {
    work: <Briefcase className="w-5 h-5" />,
    dumbbell: <Dumbbell className="w-5 h-5" />,
    graduation: <GraduationCap className="w-5 h-5" />,
    bookOpen: <BookOpenText className="w-5 h-5" />,
    notebook: <NotebookPen className="w-5 h-5" />,
    code: <Code className="w-5 h-5" />,
    car: <Car className="w-5 h-5" />,
    apple: <Apple className="w-5 h-5" />,
    drill: <Drill className="w-5 h-5" />,
    aperture: <Aperture className="w-5 h-5" />,
    atom: <Atom className="w-5 h-5" />,
    bike: <Bike className="w-5 h-5" />,
    brush: <Brush className="w-5 h-5" />,
    brain: <Brain className="w-5 h-5" />,
    cat: <Cat className="w-5 h-5" />,
    camera: <Camera className="w-5 h-5" />,
    dollar: <CircleDollarSign className="w-5 h-5" />,
    clipboard: <ClipboardPenLine className="w-5 h-5" />,
    flask: <FlaskConical className="w-5 h-5" />,
    monitor: <Monitor className="w-5 h-5" />,
    shirt: <Shirt className="w-5 h-5" />,
    music: <Music className="w-5 h-5" />,
    guitar: <Guitar className="w-5 h-5" />,
    piano: <Piano className="w-5 h-5" />,
    drum: <Drum className="w-5 h-5" />,
    mic: <Mic className="w-5 h-5" />,
    backpack: <Backpack className="w-5 h-5" />,
    dog: <Dog className="w-5 h-5" />,
    keyboard: <Keyboard className="w-5 h-5" />,
    hammer: <Hammer className="w-5 h-5" />,
    medal: <Medal className="w-5 h-5" />,
    wrench: <Wrench className="w-5 h-5" />,
    tablets: <Tablets className="w-5 h-5" />,
    stethoscope: <Stethoscope className="w-5 h-5" />,
    store: <Store className="w-5 h-5" />,
  };

  interface workspace {
    id: number;
    icon: keyof typeof Icons;
    title: string;
    description: string;
  }

  const dummyWorkspaces: workspace[] = [
    {
      id: 1,
      icon: "work",
      title: "Project Management Hub",
      description: "Organize and track all your business projects",
    },
    {
      id: 2,
      icon: "code",
      title: "Development Studio",
      description: "Full-stack development environment",
    },
    {
      id: 3,
      icon: "graduation",
      title: "Learning Center",
      description: "Educational resources and course materials",
    },
    {
      id: 4,
      icon: "camera",
      title: "Photography Portfolio",
      description: "Showcase your best photography work",
    },
    {
      id: 5,
      icon: "music",
      title: "Music Production",
      description: "Create and mix your latest tracks",
    },
    {
      id: 6,
      icon: "apple",
      title: "Nutrition Tracker",
      description: "Monitor your daily meals and health goals",
    },
    {
      id: 7,
      icon: "dumbbell",
      title: "Fitness Tracker",
      description: "Monitor workouts and health progress",
    },
    {
      id: 8,
      icon: "dollar",
      title: "Finance Dashboard",
      description: "Budget tracking and expense management",
    },
    {
      id: 9,
      icon: "brain",
      title: "Research Lab",
      description: "Scientific research and data analysis",
    },
    {
      id: 10,
      icon: "brush",
      title: "Design Studio",
      description: "Creative designs and artistic projects",
    },
    {
      id: 11,
      icon: "car",
      title: "Auto Workshop",
      description: "Vehicle maintenance and repair logs",
    },
    {
      id: 12,
      icon: "store",
      title: "E-commerce Hub",
      description: "Online store management and inventory",
    },
    {
      id: 13,
      icon: "stethoscope",
      title: "Health Monitor",
      description: "Personal health tracking and records",
    },
    {
      id: 14,
      icon: "guitar",
      title: "Band Practice",
      description: "Song arrangements and practice sessions",
    },
    {
      id: 15,
      icon: "flask",
      title: "Chemistry Lab",
      description: "Experiment tracking and lab notebooks",
    },
    {
      id: 16,
      icon: "backpack",
      title: "Travel Planner",
      description: "Trip itineraries and adventure logs",
    },
    {
      id: 17,
      icon: "cat",
      title: "Pet Care",
      description: "Track your pets health and activities",
    },
    {
      id: 18,
      icon: "hammer",
      title: "DIY Projects",
      description: "Home improvement and crafting projects",
    },
    {
      id: 19,
      icon: "notebook",
      title: "Personal Journal",
      description: "Daily thoughts and life reflections",
    },
    {
      id: 20,
      icon: "medal",
      title: "Achievement Board",
      description: "Track your goals and milestones",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Workspaces</h1>
          <p className="text-sm  mb-6">
            Manage your workspaces and projects here.
          </p>
        </div>
        <button className="btn">
          <WandSparkles className="w-4 h-4 mr-2" /> Create
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dummyWorkspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-3">
              <div className=" mr-3 flex-shrink-0 text-primary">
                {Icons[workspace.icon]}
              </div>
              <p className="font-semibold  truncate">{workspace.title}</p>
            </div>
            <p className="text-sm ">{workspace.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workspace;
