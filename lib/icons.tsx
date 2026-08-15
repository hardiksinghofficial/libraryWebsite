import React from "react";
import { 
  FaBookOpen,
  FaBook,
  FaClock,
  FaTrophy,
  FaWifi,
  FaSnowflake,
  FaDroplet,
  FaVideo,
  FaBox,
  FaPlug,
  FaMugHot,
  FaRestroom,
  FaChair,
  FaDesktop,
  FaCar,
  FaNewspaper,
  FaBrain,
  FaVolumeXmark,
  FaUsers,
  FaPrint
} from "react-icons/fa6";

export interface IconRegistryEntry {
  key: string;
  name: string;
  element: React.ReactNode;
}

export const iconRegistry: Record<string, IconRegistryEntry> = {
  FaWifi: { key: "FaWifi", name: "High-Speed Wi-Fi", element: <FaWifi /> },
  FaSnowflake: { key: "FaSnowflake", name: "Air Conditioning", element: <FaSnowflake /> },
  FaPlug: { key: "FaPlug", name: "Charging Ports", element: <FaPlug /> },
  FaDroplet: { key: "FaDroplet", name: "RO Drinking Water", element: <FaDroplet /> },
  FaVideo: { key: "FaVideo", name: "CCTV Security", element: <FaVideo /> },
  FaBox: { key: "FaBox", name: "Personal Lockers", element: <FaBox /> },
  FaBookOpen: { key: "FaBookOpen", name: "Extensive Library", element: <FaBookOpen /> },
  FaBook: { key: "FaBook", name: "Study Material", element: <FaBook /> },
  FaClock: { key: "FaClock", name: "24/7 Access", element: <FaClock /> },
  FaVolumeXmark: { key: "FaVolumeXmark", name: "Strict Quiet Zone", element: <FaVolumeXmark /> },
  FaMugHot: { key: "FaMugHot", name: "Coffee / Tea", element: <FaMugHot /> },
  FaRestroom: { key: "FaRestroom", name: "Clean Washrooms", element: <FaRestroom /> },
  FaChair: { key: "FaChair", name: "Ergonomic Chairs", element: <FaChair /> },
  FaDesktop: { key: "FaDesktop", name: "Spacious Desks", element: <FaDesktop /> },
  FaCar: { key: "FaCar", name: "Safe Parking", element: <FaCar /> },
  FaNewspaper: { key: "FaNewspaper", name: "Daily Newspapers", element: <FaNewspaper /> },
  FaBrain: { key: "FaBrain", name: "Focus Environment", element: <FaBrain /> },
  FaUsers: { key: "FaUsers", name: "Discussion Rooms", element: <FaUsers /> },
  FaPrint: { key: "FaPrint", name: "Printing/Xerox", element: <FaPrint /> },
  FaTrophy: { key: "FaTrophy", name: "Success Environment", element: <FaTrophy /> },
};

export function getSkillIcon(iconKey: string): React.ReactNode {
  return iconRegistry[iconKey]?.element || <span className="text-sm">?</span>;
}

export function getAvailableIcons(): IconRegistryEntry[] {
  return Object.values(iconRegistry);
}
