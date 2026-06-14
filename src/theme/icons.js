import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export function HomeIcon({ color = "#000000", size = 32 }) {
  return (
    <MaterialCommunityIcons
      name="home-outline"
      size={size}
      color={color}
    />
  );
}

export function BagIcon({ color = "#000000", size = 32 }) {
  return (
    <MaterialCommunityIcons
      name="shopping-outline"
      size={size}
      color={color}
    />
  );
}

export function PlusIcon({ color = "#FFFFFF", size = 32 }) {
  return (
    <MaterialCommunityIcons
      name="plus"
      size={size}
      color={color}
    />
  );
}

export function ChartIcon({ color = "#000000", size = 32 }) {
  return (
    <MaterialCommunityIcons
      name="chart-bar"
      size={size}
      color={color}
    />
  );
}

export function SettingsIcon({ color = "#000000", size = 32 }) {
  return (
    <MaterialCommunityIcons
      name="cog-outline"
      size={size}
      color={color}
    />
  );
}