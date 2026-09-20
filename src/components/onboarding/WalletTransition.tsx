import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import type { VisitorCard, CardColor } from '../../lib/visitor';
import { playSlotIn, playWhoosh } from '../../lib/wallet-sound';

type AnyCard = {
  id?: string;
  number: number;
  name: string;
  color: CardColor;
  issuedAt?: string;
  signature?: string | null;
};

const BUTTERFLIES: string[] = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⢔⣶⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡼⠗⡿⣾⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠓⡞⢩⣯⡀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠰⡹⠁⢰⠃⣩⣿⡇⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢷⣿⠿⣉⣩⠛⠲⢶⡠⢄⠐⣣⠃⣰⠗⠋⢀⣯⠁⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣯⣠⠬⠦⢤⣀⠈⠓⢽⣾⢔⣡⡴⠞⠻⠙⢳⡄",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣵⣳⠖⠉⠉⢉⣩⣵⣿⣿⣒⢤⣴⠤⠽⣬⡇",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢻⣟⠟⠋⢡⡎⢿⢿⠳⡕⢤⡉⡷⡽⠁",
  "⣧⢮⢭⠛⢲⣦⣀⠀⠀⠀⠠⡀⠀⠀⠀⡾⣥⣏⣖⡟⠸⢺⠀⠀⠈⠙⠋⠁⠀⠀",
  "⠈⠻⣶⡛⠲⣄⠀⠙⠢⣀⠀⢇⠀⠀⠀⠘⠿⣯⣮⢦⠶⠃⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⢻⣿⣥⡬⠽⠶⠤⣌⣣⣼⡔⠊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⢠⣿⣧⣤⡴⢤⡴⣶⣿⣟⢯⡙⠒⠤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠘⣗⣞⣢⡟⢋⢜⣿⠛⡿⡄⢻⡮⣄⠈⠳⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠈⠻⠮⠴⠵⢋⣇⡇⣷⢳⡀⢱⡈⢋⠛⣄⣹⣲⡀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣱⡇⣦⢾⣾⠿⠟⠿⠷⠷⣻⠧⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠽⠞⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
];

const TEAL_ART: string[] = [
  "⠀⠀⠀⢸⣦⡀⠀⠀⠀⠀⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⢸⣏⠻⣶⣤⡶⢾⡿⠁⠀⢠⣄⡀⢀⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⣀⣼⠷⠀⠀⠁⢀⣿⠃⠀⠀⢀⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠴⣾⣯⣅⣀⠀⠀⠀⠈⢻⣦⡀⠒⠻⠿⣿⡿⠿⠓⠂⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠉⢻⡇⣤⣾⣿⣷⣿⣿⣤⠀⠀⣿⠁⠀⠀⠀⢀⣴⣿⣿⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠸⣿⡿⠏⠀⢀⠀⠀⠿⣶⣤⣤⣤⣄⣀⣴⣿⡿⢻⣿⡆⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠟⠁⠀⢀⣼⠀⠀⠀⠹⣿⣟⠿⠿⠿⡿⠋⠀⠘⣿⣇⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⢳⣶⣶⣿⣿⣇⣀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀⠀⠛⠿⣿⣦⣤⣀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⣹⣿⣿⣿⣿⠿⠋⠁⠀⣹⣿⠳⠀⠀⠀⠀⠀⠀⢀⣠⣽⣿⡿⠟⠃",
  "⠀⠀⠀⠀⠀⢰⠿⠛⠻⢿⡇⠀⠀⠀⣰⣿⠏⠀⠀⢀⠀⠀⠀⣾⣿⠟⠋⠁⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠀⠀⣰⣿⣿⣾⣿⠿⢿⣷⣀⢀⣿⡇⠁⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠋⠉⠁⠀⠀⠀⠀⠙⢿⣿⣿⠇⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀",
];

const GREEN_ART: string[] = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⠴⢤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⢾⣛⡆⠈⡏⠰⠶⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢦⣿⣄⣉⣁⣤⠽⣦⣤⡶⠶⣤⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠚⠹⡉⢃⣴⠟⠉⠀⠀⠀⠀⠉⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⢡⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡂⣿⡇⠀⠀⠀⠀⣠⣤⣀⠀⠀⠀⠘⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⢻⣷⠀⠀⠀⠀⢯⡉⣿⡆⠀⠀⣰⡇⠀⢀⣀⢤⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣧⣀⠀⠀⢀⣴⡟⠀⠀⣰⣿⡷⢏⡭⠔⠹⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠿⠿⠟⠋⠀⢀⣼⣿⣿⣿⠿⣭⡉⢛⡃⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⣀⣤⠶⠿⣟⣟⣝⡷⣲⢤⣀⠀⠀⠀⠀⠀⠀⢠⠀⠀⠀⠀⠀⠀⣠⣾⡿⠃⠹⡟⢖⠢⠽⠦⠁⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⢀⣴⠞⠁⠀⠀⠀⠀⠀⠉⠙⢦⣕⡯⣷⣄⠀⠀⠠⣴⠋⢓⡶⠂⠀⢀⣼⣿⠟⠁⠀⠀⠈⠺⡄⠋⣀⣰⣀⠀⠀⠀⠀⠀⠀",
  "⠀⣠⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢯⣒⢭⣦⠀⠀⢸⠕⠦⠇⠀⣤⣿⡿⠃⣠⠴⠶⠶⣤⡀⠀⠀⠼⠿⡏⠀⠀⠀⠀⠀⠀",
  "⢀⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣝⡫⢧⠀⠀⠀⠀⣠⣾⡿⠉⠀⢸⠁⢀⣀⠀⠈⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⣼⠁⠀⠀⠀⠀⣠⣶⣿⣿⣷⣦⡀⠀⠀⠀⠀⠙⡮⣛⡆⠀⠀⣰⣿⡏⢐⡀⠀⠸⣦⣀⣨⠇⠒⣸⣀⣀⣄⣀⡀⠀⠀⠀⠀⠀⠀",
  "⢹⠆⠀⠀⠀⢠⣿⡿⠃⠀⠀⠉⢻⡄⠀⠀⠀⠀⠙⣗⢿⠀⣸⡟⡙⢷⡈⢠⠀⡀⠈⠉⣁⠘⣠⠟⠉⠉⠙⢿⣿⡆⠀⠀⠀⠀⠀",
  "⠘⣇⠀⠀⠀⠈⢿⡇⠀⢲⠀⠀⠀⢻⡀⠀⢤⣴⡀⠹⣽⣴⡿⣁⠀⠈⠻⣦⣤⣥⣌⣡⡤⠞⠁⠀⣰⠛⠆⣸⣿⡇⠀⠀⠀⠀⠀",
  "⠀⢻⡄⠀⠀⠀⠀⠉⠙⠉⠀⠀⠀⢸⠀⠀⠚⠻⠁⠀⢿⣿⢣⢀⡤⠶⠲⢮⣍⡉⠉⠁⠀⣤⠀⠀⠘⢿⣿⡿⠏⠀⠀⠀⠀⠀⠀",
  "⠀⠀⢻⣄⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠀⡀⠀⠀⠀⠀⢸⣿⣰⠏⢀⡴⢶⡄⢸⡇⠀⢖⠚⠉⠓⣲⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠙⠷⣦⣄⣀⣀⣠⣴⠾⠁⠀⢰⣕⢲⣪⡉⠅⣾⣿⡟⠀⠈⠳⠭⠵⠋⠀⠀⣼⣁⢄⣸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠀⠀⠀⢤⡼⠉⢹⡣⣉⠀⣿⣿⡇⠀⠀⢠⣴⠶⢦⡀⠀⠁⠀⠀⣙⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡔⠟⡛⡀⡆⣿⡟⣷⠀⠀⣿⣇⣲⠈⡿⢀⣴⣾⣿⠿⠿⣿⣷⣦⡀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⢰⡀⡷⣰⣇⡴⠠⠜⠀⠀⠀⠀⣿⡇⡘⣷⣄⠀⠙⣉⠞⢡⣿⡟⠁⠀⠀⠀⠀⠈⠻⣿⣆⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠠⣤⣯⣷⣧⠿⠵⠶⠶⣤⣄⡀⠀⢻⣇⠡⡌⠻⣏⠉⠁⠀⢺⣿⠀⠀⢀⣶⣶⣤⠀⠀⠘⣿⡀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠠⢾⡿⡋⠗⠈⠃⠈⠁⠰⠉⡻⢶⣜⣿⢘⠂⣠⣌⣷⡀⠀⢸⣿⡆⠀⠈⠧⠄⢸⡇⠀⠀⣹⠇⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⣰⠏⠄⠁⠀⠀⠀⠀⠀⠀⠀⠁⠈⠙⢿⣏⠰⡏⣬⣿⢻⡀⠀⠻⣿⣄⠀⠀⣠⠞⠀⠀⢠⡟⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⢰⡏⠴⠀⠀⠀⠀⢀⣠⣀⣀⠀⠀⠀⠀⠈⢻⣧⡙⢦⣤⡾⠁⠀⠀⠈⠙⠛⠋⠁⠀⠀⣠⡞⠁⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠸⢿⡀⠀⠀⠀⣰⠋⠁⠀⠉⠙⢦⠀⠀⠀⠀⢻⣟⢦⣄⡀⠀⠀⠀⠀⠀⠀⠀⣀⣤⠾⠋⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⢹⡹⣇⠀⠀⠘⡇⠀⠀⠖⡆⠀⠘⣧⠀⠀⠀⠀⠻⣎⢿⠹⠳⢲⡲⢶⠶⠾⠛⠉⣁⣠⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠸⣎⡹⣧⡀⠀⠻⣦⣤⠴⠃⠀⢰⠏⠀⣤⣀⣴⠀⠙⣧⡱⡀⢠⡾⢟⣛⡓⣆⠀⠿⣿⠛⠁⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠱⣊⠜⣻⣶⣄⣀⠀⠀⠀⣀⠟⠠⣔⣊⠁⣶⣄⠀⠈⢷⣅⢸⠅⢸⣓⣃⣼⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠙⢮⡞⡜⡝⡝⡟⡯⠟⠁⠀⠀⠀⠈⠿⠀⠀⠀⠀⠀⠹⣶⡳⢤⣹⣯⡥⠴⠶⠶⠦⣄⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣤⣀⠀⠈⠻⣦⡀⠀⠀⡞⣙⣷⠀⢈⡆⠀⠀⣀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⠏⣤⢈⣿⠀⠀⠀⠈⠳⣄⠈⣷⣈⣉⣠⡼⢡⡾⠛⠉⠙⢳⡀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣄⠈⠉⠁⢀⣀⣤⣶⣶⣾⣷⣌⠙⠋⠁⠀⣿⠀⢤⡀⠀⠀⣷",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠛⠛⠉⠁⡼⠋⢠⠨⠍⡳⢄⡀⠀⠘⠻⠛⠁⠀⣰⡿",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇⣔⡒⡞⡀⠁⠰⠙⡲⢦⣤⣤⣤⣾⠿⠁",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠺⠞⠧⠁⠀⠀⠀⠁⠐⠉⠉⠉⠀⠀⠀",
];

const ORANGE_ART: string[] = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣤⣴⣦⣦⡄⠀⠀⠀⠀",
  "⠀⠀⠀⣀⣤⣤⣤⣤⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀",
  "⠀⣰⣿⣿⠿⢿⣿⣿⣿⣿⣿⣷⣦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⣿⣿⣿⠿⠛⠉⠉⠁⠉⠉⠙⠻⣧⠀",
  "⣰⣿⣿⡟⠀⠀⠈⠙⠛⠿⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡆",
  "⣿⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠿⢿⣿⣿⣦⣀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣽⣧",
  "⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⢀⠈⠙⠻⣿⣷⣄⣤⣤⣤⣦⣾⡿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣿⡿",
  "⣿⣿⣿⣷⣄⣀⣀⣀⣀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣶⣶⣿⣶⣶⣤⣀⠀⠀⢀⠀⠀⠀⠀⣀⣠⣾⣿⣿⠃",
  "⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠛⠋⠉⠉⣴⣾⣿⣿⣿⣿⣿⣿⣯⣍⠉⠛⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠃⠀",
  "⠀⠀⠉⠛⠻⠿⠿⠿⠿⠿⠿⠛⠋⠀⠀⠀⠀⢠⣾⣿⣿⠟⠁⠁⠀⠈⠻⣿⣿⣷⡀⠀⠀⠉⠛⠻⠿⠿⠻⠿⠿⠟⠋⠁⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⠃⠀⠀⠀⠀⠀⠀⠹⣿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⣀⣠⣤⣴⣶⣶⣾⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣷⣦⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⣴⣿⣿⣿⠟⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀",
  "⠀⣸⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠛⠻⣿⣿⣿⣧⡀⠀⠀⠀",
  "⢀⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣧⠀⠀⠀",
  "⠸⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⡆⠀⠀",
  "⠀⠹⠂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⡧⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⠏⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠟⠀⠀⠀",
];

type ArtConfig = {
  lines: string[];
  fontSize: string;
  right: string;
  bottom: string;
  lineHeight: string;
  glimmerCount: number;
  seed: number;
};

const ARTS: Record<CardColor, ArtConfig> = {
  pink: { lines: BUTTERFLIES, fontSize: "15px", lineHeight: "1.08", right: "-32px", bottom: "-18px", glimmerCount: 14, seed: 0xa1b2 },
  neutral: { lines: BUTTERFLIES, fontSize: "15px", lineHeight: "1.08", right: "-32px", bottom: "-18px", glimmerCount: 14, seed: 0x4242 },
  teal: { lines: TEAL_ART, fontSize: "15px", lineHeight: "1.08", right: "-10px", bottom: "-8px", glimmerCount: 12, seed: 0x7e4c },
  green: { lines: GREEN_ART, fontSize: "7.5px", lineHeight: "1.1", right: "-6px", bottom: "-16px", glimmerCount: 20, seed: 0x0f1b },
  orange: { lines: ORANGE_ART, fontSize: "9px", lineHeight: "1.08", right: "-8px", bottom: "-6px", glimmerCount: 16, seed: 0xfc03 },
};

function mulberry32(a: number) {
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickGlimmers(lines: string[], count: number, seed: number) {
  const rng = mulberry32(seed);
  const positions: Array<{ row: number; col: number }> = [];
  for (let r = 0; r < lines.length; r++) {
    const chars = Array.from(lines[r]);
    for (let c = 0; c < chars.length; c++) {
      const ch = chars[c];
      if (ch !== "⠀" && ch !== " " && ch !== "") positions.push({ row: r, col: c });
    }
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return positions.slice(0, count).map((p) => ({
    row: p.row,
    col: p.col,
    delay: Number((rng() * 3.6).toFixed(2)),
    duration: Number((2.2 + rng() * 1.6).toFixed(2)),
  }));
}

function renderArtHtml(cfg: ArtConfig): { html: string; style: string } {
  const glimmers = pickGlimmers(cfg.lines, cfg.glimmerCount, cfg.seed);
  const glimmerMap = new Map<string, { delay: number; duration: number }>();
  for (const g of glimmers) {
    glimmerMap.set(`${g.row}:${g.col}`, { delay: g.delay, duration: g.duration });
  }
  const html = cfg.lines
    .map((line, r) => {
      const chars = Array.from(line);
      return chars
        .map((ch, c) => {
          const g = glimmerMap.get(`${r}:${c}`);
          if (g) {
            return `<span class="glimmer" style="--glimmer-delay:${g.delay}s;--glimmer-duration:${g.duration}s">${ch}</span>`;
          }
          return ch;
        })
        .join("");
    })
    .join("\n");
  const style = `font-size:${cfg.fontSize};line-height:${cfg.lineHeight};right:${cfg.right};bottom:${cfg.bottom};`;
  return { html, style };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c as keyof typeof escapeMap]!));
}
const escapeMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };


function buildCard(card: AnyCard, signatureDataUrl?: string): HTMLElement {
  const el = document.createElement("article");
  el.className = "library-card wallet-mini relative w-[388px] h-[252px] rounded-[24px] overflow-hidden p-7 flex flex-col text-[var(--color-ink-inverted)] font-[family-name:var(--font-mono)] uppercase select-none";
  el.dataset.color = card.color;
  el.dataset.name = card.name;

  const issued = card.issuedAt ? new Date(card.issuedAt) : new Date();
  const date = `${String(issued.getMonth() + 1).padStart(2, "0")}/${String(issued.getDate()).padStart(2, "0")}/${String(issued.getFullYear()).slice(-2)}`;

  const artBlocks = (Object.keys(ARTS) as CardColor[])
    .map((key) => {
      const { html, style } = renderArtHtml(ARTS[key]);
      return `<pre aria-hidden="true" data-for="${key}" class="library-card__flower absolute pointer-events-none whitespace-pre" style="${style}">${html}</pre>`;
    })
    .join("");

  const sig = signatureDataUrl ?? card.signature ?? null;
  const sigHtml = sig ? `<img class="wallet-signature" src="${sig}" alt="" aria-hidden="true" />` : "";

  el.innerHTML = `
    ${artBlocks}
    <h2 class="font-[family-name:var(--font-display)] font-light text-[24px] leading-none normal-case relative">Rohit&rsquo;s World</h2>
    <dl class="mt-6 flex flex-col gap-2 relative">
      <div class="flex flex-col">
        <dt class="text-[14px] leading-none text-[var(--card-tint)]">Visitor</dt>
        <dd class="text-[18px] leading-none mt-1.5">${escapeHtml(card.name)}</dd>
      </div>
      <div class="flex flex-col mt-2">
        <dt class="text-[14px] leading-none text-[var(--card-tint)]">Issued on</dt>
        <dd class="text-[18px] leading-none mt-1.5">${date}</dd>
      </div>
    </dl>
    <div class="mt-auto flex items-end justify-between relative">
      <p class="text-[14px] leading-none text-[var(--card-tint)]">No. ${card.number}</p>
      <div class="flex items-end gap-2 grow ml-12">
        <span class="text-[18px] leading-none">x</span>
        <span class="block flex-1 border-b border-[var(--color-ink-inverted)] mb-1"></span>
      </div>
    </div>
    ${sigHtml}
  `;
  return el;
}

function snapshotSignature(): string | undefined {
  const pad = document.querySelector<HTMLCanvasElement>("#library-card [data-signature-pad]");
  if (!pad) return undefined;
  try {
    if (!pad.width || !pad.height) return undefined;
    return pad.toDataURL("image/png");
  } catch {
    return undefined;
  }
}

async function fetchOthers(excludeId: string | undefined, seedCount = 0): Promise<AnyCard[]> {
  try {
    const { SEED_VISITORS } = await import("../../lib/seed-visitors");
    const list = SEED_VISITORS.filter((v) => v.id !== excludeId).map((v) => ({ ...v, number: v.number + seedCount }));
    return list;
  } catch {
    return [];
  }
}

export const WalletTransition: React.FC = () => {
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPlay = async (e: Event) => {
      const overlay = overlayRef.current;
      const bg = bgRef.current;
      const track = trackRef.current;
      if (!overlay || !bg || !track) return;

      const issued = (e as CustomEvent<VisitorCard>).detail;
      const signatureDataUrl = snapshotSignature();

      const { SEED_VISITORS } = await import("../../lib/seed-visitors");
      const seedCount = SEED_VISITORS.length;

      const others = await fetchOthers(issued.id, seedCount);

      const gap = 32;
      const cardW = 388;
      const flanksTotal = Math.max(2, Math.floor((window.innerWidth - cardW) / (cardW + gap)));
      const queue = others.slice(0, flanksTotal);
      const leftCount = Math.ceil(queue.length / 2);

      track.innerHTML = '';
      const elements: HTMLElement[] = [];

      queue.forEach((c, i) => {
        const el = buildCard(c);
        track.appendChild(el);
        elements.push(el);
        gsap.set(el, {
          x: window.innerWidth + i * (cardW + gap),
          y: 0,
          opacity: 1,
          scale: 0.92,
        });
      });

      const hero = buildCard({ ...issued, number: issued.number + seedCount }, signatureDataUrl);
      hero.dataset.hero = "true";
      track.appendChild(hero);
      elements.push(hero);
      gsap.set(hero, { x: 0, y: -window.innerHeight * 0.6, opacity: 0, scale: 1 });

      overlay.style.pointerEvents = "auto";
      overlay.removeAttribute("aria-hidden");
      gsap.to(overlay, { opacity: 1, duration: 0.25 });
      gsap.to(bg, { opacity: 1, duration: 0.4 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          try { sessionStorage.setItem("wallet:arrival", "1"); } catch { }
          navigate("/");
        },
      });

      function slotX(i: number): number {
        if (i < leftCount) {
          const distFromHero = leftCount - i;
          return -distFromHero * (cardW + gap);
        } else {
          const r = i - leftCount;
          return (r + 1) * (cardW + gap);
        }
      }

      queue.forEach((_c, i) => {
        const el = elements[i];
        tl.to(el, { x: slotX(i), duration: 0.7 }, i * 0.08);
      });

      tl.to(
        hero,
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
          onStart: () => {
            window.setTimeout(playSlotIn, 380);
          },
        },
        ">-0.2"
      );

      tl.to(hero, { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1, ease: "power1.inOut" });
      tl.to({}, { duration: 0.6 });

      const pack = elements.filter((el) => el !== hero);
      tl.to(
        pack,
        {
          x: `-=${window.innerWidth + cardW}`,
          duration: 0.65,
          stagger: 0.035,
          ease: "power3.in",
          onStart: playWhoosh,
        },
        "+=0"
      );

      const sidebarW = 303;
      const sidebarHalf = sidebarW / 2;
      const heroTargetX = -((window.innerWidth / 2) - sidebarHalf - 60);
      const heroTargetY = -((window.innerHeight / 2) - 220);

      const heroExitMs = 900;
      tl.to(
        hero,
        {
          x: heroTargetX,
          y: heroTargetY,
          scale: 0.22,
          opacity: 0,
          rotation: -6,
          duration: heroExitMs / 1000,
          ease: "power2.in",
          onStart: () => {
            hero.style.filter = "drop-shadow(0 0 24px var(--card-tint, rgba(255,255,255,0.6))) drop-shadow(0 0 56px rgba(255,255,255,0.35))";
          },
        },
        "-=0.55"
      );
    };

    window.addEventListener("wallet:play", onPlay);
    return () => window.removeEventListener("wallet:play", onPlay);
  }, [navigate]);

  return (
    <>
      <style>{`
        .wallet-mini {
          position: absolute;
          left: 50%;
          top: 50%;
          margin-left: -194px;  /* -cardW / 2 */
          margin-top: -126px;   /* -cardH / 2 */
          will-change: transform, opacity;
          box-shadow: 0 12px 32px -12px rgba(0, 0, 0, 0.25);
        }
        .wallet-mini .wallet-signature {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          user-select: none;
        }
      `}</style>
      <div
        ref={overlayRef}
        data-wallet-overlay
        aria-hidden="true"
        className="fixed inset-0 z-50 grid place-items-center pointer-events-none opacity-0"
      >
        <div
          ref={bgRef}
          data-wallet-bg
          className="absolute inset-0 bg-[var(--color-bg)] opacity-0"
        ></div>

        <div
          ref={trackRef}
          data-wallet-track
          className="relative w-full h-[252px] overflow-visible flex items-center justify-center"
        ></div>
      </div>
    </>
  );
};
