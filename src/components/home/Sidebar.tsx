import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

export type CardColor = "pink" | "teal" | "green" | "orange" | "neutral";

export interface VisitorCardData {
  name: string;
  color: CardColor;
  number: number;
  signature?: string | null;
}

export interface SidebarProps {
  active?: "work" | "about" | "playground" | "gallery";
  anon?: boolean;
  visitorCard?: VisitorCardData | null;
  className?: string;
  children?: React.ReactNode;
}

export type TagProps = SidebarProps;

const SPARK_COLORS = [
  "var(--color-pink)",
  "var(--color-teal)",
  "var(--color-orange)",
  "var(--color-green-1)",
];

const CARD_ARTS: Record<string, string> = {
  teal: `⠀⠀⠀⢸⣦⡀⠀⠀⠀⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⢸⣏⠻⣶⣤⡶⢾⡿⠁⠀⢠⣄⡀⢀⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣀⣼⠷⠀⠀⠁⢀⣿⠃⠀⠀⢀⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠴⣾⣯⣅⣀⠀⠀⠀⠈⢻⣦⡀⠒⠻⠿⣿⡿⠿⠓⠂⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠉⢻⡇⣤⣾⣿⣷⣿⣿⣤⠀⠀⣿⠁⠀⠀⠀⢀⣴⣿⣿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠸⣿⡿⠏⠀⢀⠀⠀⠿⣶⣤⣤⣤⣄⣀⣴⣿⡿⢻⣿⡆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠟⠁⠀⢀⣼⠀⠀⠀⠹⣿⣟⠿⠿⠿⡿⠋⠀⠘⣿⣇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢳⣶⣶⣿⣿⣇⣀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀⠀⠛⠿⣿⣦⣤⣀⠀⠀
⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⠿⠋⠁⠀⣹⣿⠳⠀⠀⠀⠀⠀⠀⢀⣠⣽⣿⡿⠟⠃
⠀⠀⠀⠀⠀⢰⠿⠛⠻⢿⡇⠀⠀⠀⣰⣿⠏⠀⠀⢀⠀⠀⠀⣾⣿⠟⠋⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠀⠀⣰⣿⣿⣾⣿⠿⢿⣷⣀⢀⣿⡇⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠉⠁⠀⠀⠀⠀⠙⢿⣿⣿⠇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀`,
  green: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢾⣛⡆⠈⡏⠰⠶⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢦⣿⣄⣉⣁⣤⠽⣦⣤⡶⠶⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠚⠹⡉⢃⣴⠟⠉⠀⠀⠀⠀⠉⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⢡⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡂⣿⡇⠀⠀⠀⠀⣠⣤⣀⠀⠀⠀⠘⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⢻⣷⠀⠀⠀⠀⢯⡉⣿⡆⠀⠀⣰⡇⠀⢀⣀⢤⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣧⣀⠀⠀⢀⣴⡟⠀⠀⣰⣿⡷⢏⡭⠔⠹⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠿⠿⠟⠋⠀⢀⣼⣿⣿⣿⠿⣭⡉⢛⡃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣀⣤⠶⠿⣟⣟⣝⡷⣲⢤⣀⠀⠀⠀⠀⠀⠀⢠⠀⠀⠀⠀⠀⠀⣠⣾⡿⠃⠹⡟⢖⠢⠽⠦⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢀⣴⠞⠁⠀⠀⠀⠀⠀⠉⠙⢦⣕⡯⣷⣄⠀⠀⠠⣴⠋⢓⡶⠂⠀⢀⣼⣿⠟⠁⠀⠀⠈⠺⡄⠋⣀⣰⣀⠀⠀⠀⠀⠀⠀
⠀⣠⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢯⣒⢭⣦⠀⠀⢸⠕⠦⠇⠀⣤⣿⡿⠃⣠⠴⠶⠶⣤⡀⠀⠀⠼⠿⡏⠀⠀⠀⠀⠀⠀
⢀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣝⡫⢧⠀⠀⠀⠀⣠⣾⡿⠉⠀⢸⠁⢀⣀⠀⠈⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣼⠁⠀⠀⠀⠀⣠⣶⣿⣿⣷⣦⡀⠀⠀⠀⠀⠙⡮⣛⡆⠀⠀⣰⣿⡏⢐⡀⠀⠸⣦⣀⣨⠇⠒⣸⣀⣀⣄⣀⡀⠀⠀⠀⠀⠀⠀
⢹⠆⠀⠀⠀⢠⣿⡿⠃⠀⠀⠉⢻⡄⠀⠀⠀⠀⠙⣗⢿⠀⣸⡟⡙⢷⡈⢠⠀⡀⠈⠉⣁⠘⣠⠟⠉⠉⠙⢿⣿⡆⠀⠀⠀⠀⠀
☘⣇⠀⠀⠀⠈⢿⡇⠀⢲⠀⠀⠀⢻⡀⠀⢤⣴⡀⠹⣽⣴⡿⣁⠀⠈⠻⣦⣤⣥⣌⣡⡤⠞⠁⠀⣰⠛⠆⣸⣿⡇⠀⠀⠀⠀⠀`,
  orange: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣤⣴⣦⣦⡄⠀⠀⠀⠀
⠀⠀⠀⣀⣤⣤⣤⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀
⠀⣰⣿⣿⠿⢿⣿⣿⣿⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⠿⠛⠉⠉⠁⠉⠉⠙⠻⣧⠀
⣰⣿⣿⡟⠀⠀⠈⠙⠛⠿⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡆
⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠿⢿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣽⣧
⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⢀⠈⠙⠻⣿⣷⣄⣤⣤⣤⣦⣾⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡿
⣿⣿⣿⣷⣄⣀⣀⣀⣀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣶⣶⣿⣶⣶⣤⣀⠀⠀⢀⠀⠀⠀⠀⣀⣠⣾⣿⣿⠃
⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠛⠋⠉⠉⣴⣾⣿⣿⣿⣿⣿⣿⣯⣍⠉⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠃⠀
⠀⠀⠉⠛⠻⠿⠿⠿⠿⠿⠿⠛⠋⠀⠀⠀⠀⢠⣾⣿⣿⠟⠁⠁⠀⠈⠻⣿⣿⣷⡀⠀⠀⠉⠛⠻⠿⠿⠻⠿⠿⠟⠋⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠹⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⣠⣤⣴⣶⣶⣾⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣴⣿⣿⣿⠟⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀
⠀⣸⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠛⠻⣿⣿⣿⣧⡀⠀⠀⠀
⢀⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣧⠀⠀⠀
⠸⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⡆⠀⠀
⠀⠹⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⡧⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⠏⠀⠀`,
  pink: `⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢔⣶⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠗⡿⣾⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠓⡞⢩⣯⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠰⡹⠁⢰⠃⣩⣿⡇⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣿⠿⣉⣩⠛⠲⢶⡠⢄⠐⣣⠃⣰⠗⠋⢀⣯⠁⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣯⣠⠬⠦⢤⣀⠈⠓⢽⣾⢔⣡⡴⠞⠻⠙⢳⡄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣵⣳⠖⠉⠉⢉⣩⣵⣿⣿⣒⢤⣴⠤⠽⣬⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢻⣟⠟⠋⢡⡎⢿⢿⠳⡕⢤⡉⡷⡽⠁
⣧⢮⢭⠛⢲⣦⣀⠀⠀⠀⠠⡀⠀⠀⠀⡾⣥⣏⣖⡟⠸⢺⠀⠀⠈⠙⠋⠁⠀⠀
⠈⠻⣶⡛⠲⣄⠀⠙⠢⣀⠀⢇⠀⠀⠀⠘⠿⣯⣮⢦⠶⠃⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢻⣿⣥⡬⠽⠶⠤⣌⣣⣼⡔⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢠⣿⣧⣤⡴⢤⡴⣶⣿⣟⢯⡙⠒⠤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠘⣗⣞⣢⡟⢋⢜⣿⠛⡿⡄⢻⡮⣄⠈⠳⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠻⠮⠴⠵⢋⣇⡇⣷⢳⡀⢱⡈⢋⠛⣄⣹⣲⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣱⡇⣦⢾⣾⠿⠟⠿⠷⠷⣻⠧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠽⠞⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`,
};

export const Sidebar: React.FC<SidebarProps> = ({
  active = "work",
  visitorCard = null,
  className = "",
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeStr, setTimeStr] = useState("--:--:-- --");
  const sparksRef = useRef<HTMLSpanElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  // Live Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h12 = ((now.getHours() + 11) % 12) + 1;
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setTimeStr(`${h12}:${mm}:${ss} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut to close mobile sidebar on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerSparks = () => {
    if (!sparksRef.current) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 24 + Math.random() * 16;
      const el = document.createElement("span");
      el.className = "spark absolute top-1/2 left-1/2 w-1 h-1 rounded-full pointer-events-none";
      el.style.transform = `translate(-50%, -50%) translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      el.style.backgroundColor = SPARK_COLORS[i % SPARK_COLORS.length];
      el.style.boxShadow = `0 0 6px ${SPARK_COLORS[i % SPARK_COLORS.length]}`;
      el.style.transition = "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s";
      el.style.opacity = "1";
      sparksRef.current.appendChild(el);

      window.setTimeout(() => {
        el.style.opacity = "0";
      }, 50);

      window.setTimeout(() => {
        el.remove();
      }, 720);
    }
  };

  const navLinks = [
    { id: "work", label: "Work", to: "/home" },
    { id: "about", label: "About", to: "/about" },
    { id: "playground", label: "Playground", to: "/playground" },
    { id: "gallery", label: "Gallery", to: "/visitor-gallery" },
  ];

  return (
    <>
      {/* Mobile Tab Toggle */}
      <button
        type="button"
        aria-label="Open sidebar"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-1/2 left-0 z-40 -translate-y-1/2 flex items-center gap-1 py-3.5 pr-2 pl-1.5 bg-[var(--color-bg-neutral-2)] text-[var(--color-ink)] rounded-r-xl shadow-md transition-transform hover:translate-x-1"
      >
        <span className="inline-flex flex-col gap-0.5">
          <span className="w-1 h-1 rounded-full bg-[var(--color-ink-dim)]"></span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-ink-dim)]"></span>
          <span className="w-1 h-1 rounded-full bg-[var(--color-ink-dim)]"></span>
        </span>
        <span className="font-mono text-base leading-none">›</span>
      </button>

      {/* Backdrop for Mobile */}
      <div
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={`lg:hidden fixed inset-0 z-45 bg-[#242424]/35 transition-opacity duration-[var(--duration-base)] ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Main Sidebar */}
      <aside
        ref={sidebarRef}
        className={`site-sidebar sticky top-0 h-[100dvh] z-40 bg-[var(--color-bg-light)] flex flex-col gap-6 p-10 w-[303px] flex-shrink-0 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-soft)] max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:max-w-[85vw] max-lg:shadow-2xl overflow-y-auto lg:overflow-visible ${
          isOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
        } ${className}`.trim()}
      >
        {/* Mobile Close Button */}
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center text-xl text-[var(--color-ink-dim)] hover:bg-[var(--color-bg-neutral-2)] hover:text-[var(--color-ink)]"
        >
          ×
        </button>

        {/* Header / Bio */}
        <div className="flex flex-col gap-2">
          <Link
            to="/home"
            aria-label="Home"
            onClick={triggerSparks}
            className="sidebar-logo-link inline-block w-fit transition-transform hover:scale-[1.08] active:scale-[1.18] relative"
          >
            <span className="sidebar-logo-spin inline-block">
              <Logo className="mb-1" />
            </span>
            <span
              ref={sparksRef}
              aria-hidden="true"
              className="sidebar-logo-sparks pointer-events-none absolute inset-0"
            />
          </Link>
          <h1 className="font-[family-name:var(--font-display)] font-light text-[36px] leading-none text-[var(--color-ink)]">
            Rohit Dhakal
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-base uppercase text-[var(--color-ink-dim)] leading-snug">
            CS &amp; Engineering
          </p>
          <p className="font-[family-name:var(--font-body)] text-base text-[var(--color-ink-dim)] leading-snug">
            I'm a developer and designer who loves building and tinkering!
          </p>
        </div>

        {/* Navigation list */}
        <nav aria-label="Main Navigation" className="flex flex-col gap-1 font-mono text-sm uppercase">
          {navLinks.map((item) => (
            <Link
              key={item.id}
              to={item.to}
              className={`py-1 transition-colors ${
                active === item.id
                  ? "text-[var(--color-ink)] font-semibold"
                  : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Outbound Links */}
        <div className="flex flex-col gap-0.5">
          <p className="font-[family-name:var(--font-mono)] text-base uppercase text-[var(--color-ink)]">
            Outbound
          </p>
          <p className="font-[family-name:var(--font-body)] text-base text-[var(--color-ink-dim)]">
            <a
              href="mailto:rohitdhakal@example.com"
              className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              Email
            </a>
            ,{" "}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              LinkedIn
            </a>
            ,{" "}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-ink-dim)] hover:text-[var(--color-ink)] underline-offset-4 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>

        {/* Visitor Card Pill & Popover */}
        {visitorCard && (
          <div className="relative group/card">
            <Link
              to="/visitor-gallery"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[20px] font-mono text-[11px] uppercase tracking-[0.12em] no-underline text-[var(--color-ink-dim)] bg-[var(--color-bg-neutral-2)] hover:text-[var(--color-ink)] hover:bg-[#cfc7af] transition-colors"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    visitorCard.color === "pink"
                      ? "var(--color-pink)"
                      : visitorCard.color === "teal"
                      ? "var(--color-teal)"
                      : visitorCard.color === "green"
                      ? "var(--color-green)"
                      : visitorCard.color === "orange"
                      ? "var(--color-orange)"
                      : "var(--color-fg-neutral)",
                }}
              />
              <span>My visitor card</span>
            </Link>

            {/* Hover card popover */}
            <div className="hidden lg:block absolute left-[calc(100%+16px)] top-1/2 -translate-y-1/2 -translate-x-2 opacity-0 pointer-events-none group-hover/card:opacity-100 group-hover/card:pointer-events-auto group-hover/card:translate-x-0 transition-all duration-200 z-50">
              <Link
                to="/visitor-gallery"
                className="flex flex-col w-[200px] min-h-[130px] p-3.5 rounded-[14px] font-mono text-[var(--color-ink-inverted)] no-underline relative overflow-hidden shadow-xl"
                style={{
                  backgroundColor:
                    visitorCard.color === "pink"
                      ? "var(--color-pink)"
                      : visitorCard.color === "teal"
                      ? "var(--color-teal)"
                      : visitorCard.color === "green"
                      ? "var(--color-green)"
                      : visitorCard.color === "orange"
                      ? "var(--color-orange)"
                      : "var(--color-bg-neutral-2)",
                  color: visitorCard.color === "neutral" ? "var(--color-ink)" : undefined,
                }}
              >
                <pre
                  className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-[5px] leading-[1.08] opacity-35 pointer-events-none whitespace-pre m-0"
                  aria-hidden="true"
                >
                  {CARD_ARTS[visitorCard.color] || CARD_ARTS.pink}
                </pre>
                <span className="font-[family-name:var(--font-display)] font-light text-[12px] leading-none">
                  Rohit's World
                </span>
                <dl className="mt-1.5 text-[10px]">
                  <dt className="text-[7px] tracking-[0.14em] uppercase opacity-65 leading-none">
                    Visitor
                  </dt>
                  <dd className="text-[10px] uppercase tracking-[0.06em] mt-0.5">
                    {visitorCard.name}
                  </dd>
                </dl>
                {visitorCard.signature && (
                  <img
                    src={visitorCard.signature}
                    alt=""
                    className="absolute right-0 bottom-0 w-4/5 h-4/5 object-contain object-bottom pointer-events-none"
                  />
                )}
                <div className="flex items-end justify-between mt-auto relative text-[7px]">
                  <span className="uppercase tracking-[0.12em] opacity-65">
                    No. {visitorCard.number}
                  </span>
                  <span className="flex items-end gap-1 text-[10px] ml-3 flex-1">
                    x{" "}
                    <span className="block flex-1 border-b border-current mb-0.5" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Live Clock Status */}
        <div className="mt-auto -mb-3 font-[family-name:var(--font-mono)] text-base uppercase text-[var(--color-ink-dim)] leading-snug">
          <p>{timeStr}</p>
        </div>

        {children}
      </aside>
    </>
  );
};

export default Sidebar;
