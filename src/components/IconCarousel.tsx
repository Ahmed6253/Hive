import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Icons } from "@/components/ui/icons";
import type { CarouselApi } from "@/components/ui/carousel";

export default function IconCarousel({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (key: string) => void;
}) {
  const keys = React.useMemo(() => Object.keys(Icons), []);
  const pageSize = 20;
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentPage, setCurrentPage] = React.useState(0);

  const pages = React.useMemo(() => {
    const out: string[][] = [];
    for (let i = 0; i < keys.length; i += pageSize) {
      out.push(keys.slice(i, i + pageSize));
    }
    return out;
  }, [keys]);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentPage(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const isVisible = (idx: number) => Math.abs(idx - currentPage) <= 1;

  return (
    <div className="relative bg-muted/30 rounded-xl p-4">
      <Carousel setApi={setApi} className="w-[85%] mx-auto">
        <CarouselContent className="py-2">
          {pages.map((page, idx) => (
            <CarouselItem
              key={`page-${idx}`}
              className="grid grid-cols-5 gap-2"
            >
              {isVisible(idx)
                ? page.map((k) => {
                    const Icon = Icons[
                      k as keyof typeof Icons
                    ] as React.ReactNode;
                    return (
                      <button
                        key={k}
                        type="button"
                        aria-label={k}
                        onClick={() => onChange?.(k)}
                        className={`p-3 rounded-xl transition-all duration-200 w-fit h-fit mx-auto flex items-center justify-center ${
                          k === value
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-muted hover:scale-105"
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          {Icon}
                        </div>
                      </button>
                    );
                  })
                : null}
            </CarouselItem>
          ))}
        </CarouselContent>
        {pages.length > 1 && (
          <>
            <CarouselPrevious className="left-0 bg-background/80" />
            <CarouselNext className="right-0 bg-background/80" />
          </>
        )}
      </Carousel>
    </div>
  );
}
