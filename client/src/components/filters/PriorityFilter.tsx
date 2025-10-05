interface Props {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

import style from "./Filters.module.scss";

export default function PriorityFilter({ filter, setFilter }: Props) {
  return (
    <div className={style.container}>
      <label className={style.label}>Пріорітет:</label>
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className={style.input}
      >
        <option value="all">Всі</option>
        <option value="high">Високий</option>
        <option value="medium">Середній</option>
        <option value="low">Низький</option>
      </select>
    </div>
  );
}
