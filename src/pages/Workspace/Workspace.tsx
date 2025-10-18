import { CirclePlus, Pencil, Trash } from "lucide-react";
import { Icons } from "../../components/ui/icons";

import { useState } from "react";

import NewWorkspace from "./NewWorkspace";

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

const Workspace = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Workspaces</h1>
          <p className="text-sm  mb-6">
            Manage your workspaces and projects here.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setShowModal(true)}
          className="p-4 bg-card rounded-lg shadow-sm hover:shadow-md pt-6 hover:pt-4 cursor-pointer flex items-center justify-center flex-col gap-2 group hover:text-primary transition-all duration-300 border text-text/80 hover:border-primary"
        >
          <CirclePlus className="w-12 h-12  stroke-1 group-hover:rotate-90 transition-all duration-300" />
          <p className="text-xs font-semibold overflow-hidden h-0 group-hover:h-4 transition-all duration-300">
            Create New Workspace
          </p>
        </div>

        {dummyWorkspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="p-4 pb-2 bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md flex flex-col group cursor-pointer border border-transparent hover:border-text transition-all duration-300"
          >
            <div className="flex items-center mb-3">
              <div className=" mr-3 flex-shrink-0 text-primary">
                {Icons[workspace.icon]}
              </div>
              <p className="font-semibold  truncate">{workspace.title}</p>
            </div>
            <p className="text-sm ">{workspace.description}</p>
            <div className="flex mt-auto pt-2 translate-y-[40px] group-hover:translate-y-0 items-end justify-end gap-2 group-hover:opacity-100 opacity-0 transition-all duration-300">
              <Pencil className="w-6 h-6 bg-text text-bg p-1 rounded-md hover:bg-text/80 transition-all duration-300" />
              <Trash className="w-6 h-6  bg-error p-1 rounded-md hover:bg-error/80 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>
      <NewWorkspace
        showModal={showModal}
        setShowModal={() => setShowModal(false)}
        Icons={Icons}
      />
    </div>
  );
};

export default Workspace;
