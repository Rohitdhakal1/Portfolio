import React from 'react';
import type { CardColor } from '../../lib/visitor';

interface Props {
  selected?: CardColor;
  name?: string;
  onChange?: (color: CardColor, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const swatches: { color: CardColor; bg: string }[] = [
  { color: 'teal', bg: 'var(--color-teal)' },
  { color: 'green', bg: 'var(--color-green)' },
  { color: 'pink', bg: 'var(--color-pink)' },
  { color: 'orange', bg: 'var(--color-orange)' },
];

export const CardColorPicker: React.FC<Props> = ({
  selected = 'pink',
  name = 'card-color',
  onChange,
}) => {
  return (
    <fieldset
      className="card-color-picker flex items-center gap-4"
      data-color-picker
      data-name={name}
    >
      <legend className="sr-only">Card color</legend>
      {swatches.map(({ color, bg }) => (
        <label key={color} className="cursor-pointer p-2 -m-2" data-cursor="dot">
          <input
            type="radio"
            name={name}
            value={color}
            checked={color === selected}
            onChange={(e) => {
              if (onChange) onChange(color, e);
            }}
            className="sr-only peer"
          />
          <span
            aria-hidden="true"
            className="block w-[26px] h-[26px] rounded-full transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-soft)] hover:scale-125 active:scale-95 peer-checked:scale-110 peer-checked:ring-2 peer-checked:ring-[var(--color-ink)] peer-checked:ring-offset-2 peer-checked:ring-offset-[var(--color-bg)]"
            style={{ background: bg }}
          />
          <span className="sr-only">{color}</span>
        </label>
      ))}
    </fieldset>
  );
};
