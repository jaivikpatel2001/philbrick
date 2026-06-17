import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { cn } from "@/utils/cn";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type AsLink = BaseProps &
  Omit<React.ComponentProps<typeof Link>, "className"> & { href: string };
type AsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type ButtonProps = AsLink | AsButton;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    withArrow = false,
    fullWidth = false,
    className,
    children,
  } = props;

  const classes = cn(
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth && styles.full,
    className
  );

  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      {withArrow && (
        <FiArrowRight className={styles.arrow} aria-hidden="true" />
      )}
    </>
  );

  if (props.href !== undefined) {
    const { variant: _v, size: _s, withArrow: _a, fullWidth: _f, className: _c, children: _ch, ...rest } =
      props as AsLink;
    return (
      <Link className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  const { variant: _v, size: _s, withArrow: _a, fullWidth: _f, className: _c, children: _ch, ...rest } =
    props as AsButton;
  return (
    <button className={classes} {...rest}>
      {inner}
    </button>
  );
}
