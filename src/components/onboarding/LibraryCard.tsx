import React, { useMemo } from 'react';
import { SignaturePad } from './SignaturePad';
import type { CardColor } from '../../lib/visitor';

interface Props {
  name: string;
  color: CardColor;
  number: number;
  issuedAt?: string;
  id?: string;
  signable?: boolean;
  signature?: string | null;
  existingSignature?: string | null;
  glimmerSeedSalt?: number;
  clearTrigger?: number;
  tool?: 'pen' | 'eraser';
  onInkChange?: (hasInk: boolean, dirty: boolean) => void;
}

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
  green: { lines: GREEN_ART, fontSize: "7.5px", lineHeight: "1.1", right: "-6px", bottom: "-16px", glimmerCount: 32, seed: 0x0f1b },
  orange: { lines: ORANGE_ART, fontSize: "9px", lineHeight: "1.08", right: "-8px", bottom: "-6px", glimmerCount: 26, seed: 0xfc03 },
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

function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

const FALLBACK_VARIANTS = ["smiley", "scribble", "heart", "initial", "star"] as const;

export const LibraryCard: React.FC<Props> = ({
  name,
  color,
  number,
  issuedAt = new Date().toISOString(),
  id = "library-card",
  signable = false,
  signature = null,
  existingSignature = null,
  glimmerSeedSalt = 0,
  tool = 'pen',
  clearTrigger,
  onInkChange
}) => {
  const issuedDate = new Date(issuedAt);
  const formatted = `${String(issuedDate.getMonth() + 1).padStart(2, "0")}/${String(issuedDate.getDate()).padStart(2, "0")}/${String(issuedDate.getFullYear()).slice(-2)}`;

  const renderedArts = useMemo(() => {
    const entries = signable ? Object.entries(ARTS) as Array<[CardColor, ArtConfig]> : [[color, ARTS[color]]] as Array<[CardColor, ArtConfig]>;
    return entries.map(([key, cfg]) => {
      const actualSeed = (cfg.seed ^ (glimmerSeedSalt | 0)) >>> 0;
      const glimmers = pickGlimmers(cfg.lines, cfg.glimmerCount, actualSeed);
      const glimmerMap = new Map<string, { delay: number; duration: number }>();
      for (const g of glimmers) glimmerMap.set(`${g.row}:${g.col}`, { delay: g.delay, duration: g.duration });

      const html = cfg.lines.map((line, r) => {
        const chars = Array.from(line);
        return chars.map((ch, c) => {
          const g = glimmerMap.get(`${r}:${c}`);
          if (g) {
            return `<span class="glimmer" style="--glimmer-delay:${g.delay}s;--glimmer-duration:${g.duration}s">${ch}</span>`;
          }
          return ch;
        }).join("");
      }).join("\n");
      const style = { fontSize: cfg.fontSize, lineHeight: cfg.lineHeight, right: cfg.right, bottom: cfg.bottom };
      return { key, html, style };
    });
  }, [color, signable, glimmerSeedSalt]);

  const fallbackVariant = FALLBACK_VARIANTS[hashString(`${name}:${number}`) % FALLBACK_VARIANTS.length];
  const firstLetter = (name.trim()[0] ?? "?").toUpperCase();
  const showFallback = !signable && !signature;

  // Map card color to pen stroke color for SignaturePad
  const penStroke = color === 'neutral' ? '#242424' : '#ffffff';

  return (
    <article
      id={id}
      data-color={color}
      data-name={name}
      className="library-card relative w-[388px] h-[252px] rounded-[24px] overflow-hidden p-7 flex flex-col text-[var(--color-ink-inverted)] font-[family-name:var(--font-mono)] uppercase select-none transition-colors duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ ['--pen-stroke' as string]: penStroke }}
    >
      {renderedArts.map((r) => (
        <pre
          key={r.key}
          aria-hidden="true"
          data-for={r.key}
          className="library-card__flower absolute pointer-events-none whitespace-pre transition-opacity duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ ...(r.style as React.CSSProperties), zIndex: 1 }}
          dangerouslySetInnerHTML={{ __html: r.html }}
        />
      ))}

      <h2 className="font-[family-name:var(--font-display)] font-light text-[24px] leading-none normal-case relative z-10 transition-colors duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
        Rohit&rsquo;s World
      </h2>

      <dl className="mt-6 flex flex-col gap-2 relative z-10">
        <div className="flex flex-col">
          <dt className="text-[14px] leading-none text-[var(--card-tint)] transition-colors duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]">Visitor</dt>
          <dd className="text-[18px] leading-none mt-1.5 transition-colors duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]" data-card-name>{name}</dd>
        </div>
        <div className="flex flex-col mt-2">
          <dt className="text-[14px] leading-none text-[var(--card-tint)] transition-colors duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]">Issued on</dt>
          <dd className="text-[18px] leading-none mt-1.5 transition-colors duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]" data-card-date>{formatted}</dd>
        </div>
      </dl>

      <div className="mt-auto flex items-end justify-between relative z-10">
        <p className="text-[14px] leading-none text-[var(--card-tint)] transition-colors duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]" data-card-number>
          No. {number}
        </p>
        <div className="flex items-end gap-2 grow ml-12">
          <span className="text-[18px] leading-none transition-colors duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]">x</span>
          <span className="block flex-1 border-b border-[var(--color-ink-inverted)] mb-1 transition-colors duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"></span>
        </div>
      </div>

      {signable && <SignaturePad cardColor={color} existingSignature={existingSignature} tool={tool} clearTrigger={clearTrigger} onInkChange={onInkChange} />}

      {!signable && signature && (
        <img
          src={signature}
          alt="signature"
          className="library-card__signature absolute inset-0 w-full h-full object-contain pointer-events-none z-10 mix-blend-normal"
          loading="lazy"
          decoding="async"
        />
      )}

      {showFallback && (
        <svg
          aria-hidden="true"
          className="library-card__fallback-sig pointer-events-none absolute left-1/2 bottom-[34px] w-[160px] h-[56px] -translate-x-[44%] -rotate-[3deg] opacity-90 z-10"
          viewBox="0 0 180 60"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {fallbackVariant === "smiley" && (
            <g>
              <circle cx="90" cy="30" r="18" />
              <circle cx="83" cy="26" r="1.6" fill="currentColor" stroke="none" />
              <circle cx="97" cy="26" r="1.6" fill="currentColor" stroke="none" />
              <path d="M80 34 Q90 44 100 34" />
              <path d="M118 20 q3 -4 6 0 q3 4 6 0" opacity="0.7" />
              <path d="M52 42 q3 -4 6 0 q3 4 6 0" opacity="0.7" />
            </g>
          )}
          {fallbackVariant === "scribble" && (
            <path d="M20 36 Q28 18 38 34 T58 32 Q68 14 76 34 T98 30 Q108 12 118 34 T140 30 Q150 16 160 34" />
          )}
          {fallbackVariant === "heart" && (
            <g>
              <path d="M70 28 q-10 -14 -22 -2 q-12 12 22 30 q34 -18 22 -30 q-12 -12 -22 2 z" />
              <path d="M102 18 l42 0 M102 30 l54 0 M102 42 l36 0" opacity="0.55" />
            </g>
          )}
          {fallbackVariant === "initial" && (
            <g>
              <text x="40" y="44" fontFamily="var(--font-display)" fontSize="44" fontStyle="italic" fontWeight="300" fill="currentColor" stroke="none">{firstLetter}</text>
              <path d="M74 44 Q98 14 126 40 T170 36" opacity="0.85" />
            </g>
          )}
          {fallbackVariant === "star" && (
            <g>
              <path d="M30 36 Q50 14 72 36 Q92 58 116 36 Q136 14 160 36" />
              <path d="M40 46 l4 -4 M148 20 l4 -4" opacity="0.65" />
              <path d="M92 8 l2 6 M96 8 l-2 6" opacity="0.7" />
            </g>
          )}
        </svg>
      )}
    </article>
  );
};
