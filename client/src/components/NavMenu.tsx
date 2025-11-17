"use client";

import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/shared/ui/navigation-menu";

interface NavMenuItem {
  name: string;
  url: string;
}

interface NavMenuProps {
  items: NavMenuItem[];
}

export const NavMenu: React.FC<NavMenuProps> = ({ items }) => {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item) => {
            return (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink asChild>
                  <Link href={item.url}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
};
