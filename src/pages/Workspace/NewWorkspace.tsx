import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../../components/Modal";
import { Input } from "../../components/ui/input";
import Label from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useState } from "react";

const NewWorkspace = ({
  showModal,
  setShowModal,
  Icons,
}: {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;

  Icons: any;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const iconsPerPage = 4;
  const totalIcons = Object.keys(Icons).length;
  const totalPages = Math.ceil(totalIcons / iconsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  return (
    <Modal
      title="Create New Workspace"
      show={showModal}
      toggleShow={() => setShowModal(!showModal)}
    >
      <div className="space-y-4 w-[500px] max-w-full">
        <div className="space-y-2 ">
          <Label htmlFor="title">Workspace Title </Label>
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="Enter workspace title"
            className="input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Workspace Description</Label>
          <Textarea
            name="description"
            id="description"
            placeholder="Enter workspace description"
            className="max-h-30"
          />
        </div>
        <div className="space-y-2 ">
          <Label htmlFor="icon">Workspace Icon</Label>
          <div className="relative bg-bg/50 rounded-md px-2 py-4 mt-1">
            <div className="grid grid-cols-4 relative px-5 py-3">
              {Object.keys(Icons)
                .slice(
                  currentPage * iconsPerPage,
                  (currentPage + 1) * iconsPerPage
                )
                .map((icon, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <div className="p-3 w-fit hover:bg-primary/20 rounded-full cursor-pointer transition-all duration-300">
                      {Icons[icon as keyof typeof Icons]}
                    </div>
                  </div>
                ))}
              <button
                onClick={handlePrevPage}
                className="absolute left-5  top-1/2 -translate-y-1/2 -translate-x-4 p-1 rounded-full  hover:bg-primary/20 transition-all duration-300"
              >
                <ChevronLeft strokeWidth={3} className="w-5 h-5 text-primary" />
              </button>
              <button
                onClick={handleNextPage}
                className="absolute right-5 top-1/2 -translate-y-1/2 translate-x-4 p-1 rounded-full  hover:bg-primary/20 transition-all duration-300"
              >
                <ChevronRight
                  strokeWidth={3}
                  className="w-5 h-5 text-primary"
                />
              </button>
            </div>
            <div className="flex justify-center items-center gap-1 my-1 ">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                    currentPage === index
                      ? "bg-primary scale-125"
                      : "bg-primary/20"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NewWorkspace;
