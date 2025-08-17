import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function ShowcaseDateSections({
  picked,
  onPicked,
  date,
  onDate,
}: {
  picked: Date | null;
  onPicked: (d: Date | null) => void;
  date?: Date;
  onDate: (d?: Date) => void;
}) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Date Picker</CardTitle>
          <CardDescription>Wrapped component</CardDescription>
        </CardHeader>
        <CardContent>
          <DatePicker value={picked} onChange={onPicked} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date Picker</CardTitle>
          <CardDescription>Calendar in a popover</CardDescription>
        </CardHeader>
        <CardContent>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {date ? date.toLocaleDateString() : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={onDate} />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
    </>
  );
}
