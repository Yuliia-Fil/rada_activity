import type { Bill } from "../../types/Bill";
import { getColor } from "../../utils/getColor";

import style from "./BillCard.module.scss";

export default function BillCard({ bill }: { bill: Bill }) {
  const borderColor = getColor(bill.priority);

  return (
    <div
      style={{ borderLeft: `6px solid ${borderColor}` }}
      className={style.container}
    >
      <div className={style.numberAndDate}>
        <h3 className={style.number}>
          <a
            href={bill.link}
            target="_blank"
            rel="noreferrer"
            className={style.link}
          >
            {bill.number}
          </a>
        </h3>
        <span className={style.date}>{bill.date}</span>
      </div>

      <p className={style.title}>{bill.title}</p>

      <p className={style.priority}>
        <span
          style={{
            backgroundColor: borderColor,
          }}
          className={style.priority_text}
        >
          {bill.priority.toUpperCase()}
        </span>
      </p>
    </div>
  );
}
