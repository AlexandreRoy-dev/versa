import type {} from "react";

/*
  The motion system drives entrance delays and pointer offsets through CSS
  custom properties set in inline styles, which React's CSSProperties does not
  allow by default.
*/
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
