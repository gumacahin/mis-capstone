import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";
import { forwardRef, useMemo } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

type ListItemNavLinkProps = React.PropsWithChildren<{
  to: string;
}> &
  Omit<ListItemButtonProps, "component" | "href">;

export default function ListItemNavLink(props: ListItemNavLinkProps) {
  type MemoedNavLinkProps = Omit<NavLinkProps, "to">;
  const MemoedNavLink = useMemo(
    () =>
      // eslint-disable-next-line react/display-name
      forwardRef<HTMLAnchorElement, MemoedNavLinkProps>((navLinkProps, ref) => {
        const { className: previousClasses, ...rest } = navLinkProps;
        const elementClasses = previousClasses?.toString() ?? "";
        return (
          <NavLink
            {...rest}
            ref={ref}
            to={props.to}
            end
            className={({ isActive }) =>
              isActive ? elementClasses + " Mui-selected" : elementClasses
            }
          />
        );
      }),
    [props.to],
  );
  MemoedNavLink.displayName = "MemoedNavLink";

  return (
    <ListItemButton
      component={MemoedNavLink}
      {...(props as ListItemButtonProps)}
    >
      {props.children}
    </ListItemButton>
  );
}

ListItemNavLink.displayName = "ListItemNavLink";
