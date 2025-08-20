import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ISchedule } from '@/types';

export const columns: ColumnDef<ISchedule>[] = [
  {
    accessorKey: 'classType',
    header: 'Class Type',
  },
  {
    accessorKey: 'trainer.name',
    header: 'Trainer',
  },
  {
    accessorKey: 'startTime',
    header: 'Time Slot',
    cell: ({ row }) => {
      const schedule = row.original;
      return `${schedule.startTime} - ${schedule.endTime}`;
    },
  },
  {
    accessorKey: 'trainees',
    header: 'Bookings',
    cell: ({ row }) => {
      const schedule = row.original;
      return `${schedule.trainees.length}/${schedule.maxTrainees}`;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = 
        status === 'upcoming' ? 'default' :
        status === 'completed' ? 'secondary' : 'destructive';
      
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const schedule = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
        </div>
      );
    },
  },
];