"use client";

import { ReactNode, Fragment } from "react";

interface TopbarProps {
  crumb?: string[];
  title?: string;
  sub?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}

export function Topbar({ crumb, title, sub, actions, badge }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="top-left">
        {crumb && (
          <div className="crumb">
            {crumb.map((c, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="sep">›</span>}
                <span className={i === crumb.length - 1 ? "here" : ""}>{c}</span>
              </Fragment>
            ))}
            {badge}
          </div>
        )}
        {title && <div className="title">{title}</div>}
        {sub && <div className="sub">{sub}</div>}
      </div>
      <div className="top-right">{actions}</div>
    </header>
  );
}
