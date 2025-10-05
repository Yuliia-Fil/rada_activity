interface Props {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

import style from "./Filters.module.scss";

export default function DateFilter({ filter, setFilter }: Props) {
  return (
    <div className={style.container}>
      <label className={style.label}>Дата:</label>
      <input
        type="date"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={style.input}
      />
    </div>
  );
}
