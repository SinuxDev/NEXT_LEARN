"use client";

import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashBoardNavProps {
  allLinks: { path: string; label: string; icon: JSX.Element }[];
}

export default function DashBoardNav({ allLinks }: DashBoardNavProps) {
  const pathName = usePathname();
  return (
    <nav className="py-4 overflow-auto">
      <ul className="flex gap-6 text-xs font-bold">
        <AnimatePresence>
          {allLinks.map((link) => (
            <motion.li whileTap={{ scale: 0.95 }} key={link.path}>
              <Link
                href={link.path}
                className={cn(
                  "flex gap-1 flex-col items-center relative",
                  pathName === link.path && "text-primary"
                )}
              >
                {link.icon}
                {link.label}
                {pathName === link.path ? (
                  <motion.div
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="h-[3px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
                  />
                ) : null}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </nav>
  );
}
