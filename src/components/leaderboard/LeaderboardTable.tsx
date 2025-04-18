
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type LeaderboardEntry = {
  id: string;
  rank: number;
  name: string;
  region: string;
  country: string;
  points: number;
  completedCourses: number;
};

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
  highlightUserId?: string;
  className?: string;
};

const LeaderboardTable = ({ 
  entries, 
  highlightUserId, 
  className 
}: LeaderboardTableProps) => {
  return (
    <div className={cn("rounded-xl border overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Rank</TableHead>
            <TableHead>Learner</TableHead>
            <TableHead>Region</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Completed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const isCurrentUser = entry.id === highlightUserId;
            const isTopThree = entry.rank <= 3;
            
            return (
              <TableRow 
                key={entry.id}
                className={cn(
                  isCurrentUser && "bg-primary/10 font-medium",
                  "transition-colors"
                )}
              >
                <TableCell className="font-medium">
                  {isTopThree ? (
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full",
                      entry.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                      entry.rank === 2 ? "bg-gray-100 text-gray-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      <Trophy className="h-4 w-4" />
                    </div>
                  ) : (
                    entry.rank
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className={cn(isCurrentUser && "text-primary")}>
                      {entry.name}
                      {isCurrentUser && " (You)"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{entry.region}</span>
                    <span className="text-xs text-muted-foreground">{entry.country}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {entry.points}
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  {entry.completedCourses}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeaderboardTable;
