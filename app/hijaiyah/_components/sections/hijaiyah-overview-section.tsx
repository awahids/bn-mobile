import { motion } from "framer-motion";
import type { HijaiyahLetterAPI } from "@/lib/api-core";
import { HijaiyahLetterOverviewCard } from "@/app/hijaiyah/_components/atoms/hijaiyah-letter-overview-card";

interface HijaiyahOverviewSectionProps {
  letters: HijaiyahLetterAPI[];
  selectedLetter: HijaiyahLetterAPI;
  getLetterProgress: (letterId: string) => { completed: boolean };
  onSelectLetter: (letter: HijaiyahLetterAPI) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1 },
};

export function HijaiyahOverviewSection({
  letters,
  selectedLetter,
  getLetterProgress,
  onSelectLetter,
}: HijaiyahOverviewSectionProps) {
  return (
    <section className="px-6 pb-32">
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <div className="grid grid-cols-4 gap-4">
          {letters.map((letter) => {
            const progress = getLetterProgress(letter.id);

            return (
              <motion.div key={letter.id} variants={itemVariants}>
                <HijaiyahLetterOverviewCard
                  letter={letter}
                  isSelected={selectedLetter.id === letter.id}
                  completed={progress.completed}
                  onSelect={onSelectLetter}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
