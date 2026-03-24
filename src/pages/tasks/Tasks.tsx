import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Column {
  id: string;
  label: string;
}

interface Task {
  name: string;
  dueDate: string;
  status: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const columns: Column[] = [
  { id: "name", label: "Task Name" },
  { id: "dueDate", label: "Due Date" },
  { id: "status", label: "Status" },
  { id: "difficulty", label: "Difficulty" },
];

const tableData: Task[] = [
  {
    name: "Task 1",
    dueDate: "2024-06-30",
    status: "In Progress",
    difficulty: "Medium",
  },
  {
    name: "Task 2",
    dueDate: "2024-07-15",
    status: "Not Started",
    difficulty: "Hard",
  },
  {
    name: "Task 3",
    dueDate: "2024-07-01",
    status: "Completed",
    difficulty: "Easy",
  },
];

const Tasks = () => {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">
          Manage your tasks and deadlines.
        </p>
      </div>

      <Table className="bg-background rounded">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.dueDate}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    row.difficulty === "Easy"
                      ? "easy"
                      : row.difficulty === "Medium"
                        ? "medium"
                        : row.difficulty === "Hard"
                          ? "hard"
                          : "default"
                  }
                >
                  {row.difficulty}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Tasks;
