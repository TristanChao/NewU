import { HabitMarker } from './HabitMarker';

type Props = {
  name: string;
  color: string;
  mark: boolean;
};
export function ListCalendar({ name, color, mark }: Props) {
  return (
    <div>
      <h1>{name}</h1>
      <HabitMarker color={color} mark={mark} />
    </div>
  );
}
